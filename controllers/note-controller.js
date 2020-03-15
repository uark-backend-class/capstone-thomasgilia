// TO DO:


const Note = require("../db").Note;
const Doc = require("../db").Doc; //just for associating docs - take out if doesn't work
const Client = require("../db").Client;

//working but replaced with listAllResources
// exports.getAllNotes = async (req, res) => {
//   try {
//     let notes = await Note.findAll();
//     res.json(notes);
//   } catch (error) {
//     console.log("HERE/'S THE ERROR" + error);
//   }
// };

//can combine/but on notedoc page later if want
//works - just brings up the form with a get. then the next function will populate and post to same route
exports.newResource = (req, res) => {
  res.render('createNoteOrDoc', { action: 'notes', buttonText: 'Create Note', resourceType: "Note" });
};
// exports.CreateResource = async (req, res) => {
//   // let resourceType = req.param.resourceType; //have to add to param...
//   let resourceType = "Document"; //temporary
//   if (resourceType == "Document") {
//     res.render("createNoteOrDoc", {
//       action: "NewDoc",
//       buttonText: "Create a new Document",
//     });
//   } else if (resourceType == "NewNote") {
//     //from button on form
//     res.render("createNoteOrDoc", {
//       action: "createResource",
//       buttonText: "Create a new Note",
//     });
//   }
// };

//-----------------think need s/t like this for my fields
// let username = req.body.username;
//   let password = req.body.password;

/* <form action="/update" method="POST">
  First Name: <input type="text" name="firstName" value="{{ student.firstName }}" />
  <br/>
  Last Name: <input type="text" name="lastName" value="{{ student.lastName }}" />
  <br/>
  Phone: <input type="text" name="phone" value="{{ student.phone }}" />
  <br/>
  <input type="hidden" name="id" value="{{ student.id }}" />
  <button class="btn btn-primary" type="submit">Submit</button>
</form> */

// exports.updateStudent = async (req, res) => {
//   req.body.userId = req.user.id;
//   await Student.upsert(req.body);  //  { firstName: "Bob", lastName: "Smith", userId: 2, phone: "555-5555" }
//   res.redirect('/');
// }

//sep routes for new notes and existing notes. new notes renders with client list choice only. existing notes render
//with client selected and docs selection avail for that client. will need the selection of client in newnote required 
//field before new note can be created
exports.newNote = async (req, res) => {
  // coming from createNoteOrDoc.hbs /post request
  try {
    // console.log(req.body);
    // let resources = await Note.create(req.body);
    //may not need the below but it resulted in cleaner list view:
    let thisNote = await Note.create(req.body); //let resources = await Note.upsert(req.body);  this also worked to create note from form
    // let thisNoteObj = thisNote.get({ plain: true });   //gives the note (just created) body as an object so can directly access id
    // console.log(thisNote.id); //gives id
    let resources = thisNote;
    let noteId = thisNote.id;     //first access to the noteId
    let allClients = await Client.findAll();
    // console.log(assoc1Id);
    res.render("viewNewNote", {
      resourceType: "Note", existingResource: false, resources, allClients, noteId, resourceType: "Note"
    });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.addNoteToClient = async (req, res) => {
  //from viewNewNote.hbs with noteId (via params and hidden noteId for now), clientId
  try {
    console.log(req.body);
    // on the note, clientId is created but null. so think need to upsert
    const clientId = req.body.clientId;
    const noteId = req.body.noteId;   //or could do req.params.noteId now i think
    const thisClient = await Client.findByPk(clientId);   //this particular client
    await thisClient.setNote(noteId);
    let resources = await Note.findByPk(noteId);    //this particular note after client associated
    let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note
    let allDocsThisClient = [];
    // let thisClientNotes = await Note.findAll({ where: { clientId: clientId } });
    // for (let note of thisClientNotes){
    //   let id = note.id;
    // let thisNote = await Note.findByPk(id, { include: [Doc] });
    // console.log(thisNote);
    // allDocsThisClient.push(thisNote.Doc);
    // }

    let allNotesThisClient = await Note.findAll({ where: { clientId: clientId } });
    for (let note of allNotesThisClient) {
      thisNoteId = note.id;       //one note's id
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
      let docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
      allDocsThisClient.push(docsForThisNote);
    }

    res.render("viewNoteOrDoc", {
      resourceType: "Note", existingResource: true, resources, allClients, docsThisNote, allDocsThisClient,
      thisClient, allNotesThisClient
    });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};
// allDocsThisClient             
// docId


exports.addDocToNote = async (req, res) => {  //just assuming one doc added at a time
  //coming from viewNoteOrDoc with docId, noteId (and on params), docAssociated hidden
  try {
    const { noteId, docId } = req.body;

    const thisNote = await Note.findByPk(noteId); //getting this note
    const thisNoteIncDocs = await Note.findByPk(noteId, { include: [Doc] });  //getting this note inc docs  //rename resources?
    let existingDocsForThisNote = await thisNoteIncDocs.getDocs();   //getting docs already on note
    let docIdArray;
    for (let doc of docsForThisNote) {
      // let docIdArray = docsForThisNote.id;  //getting ids already on note
      docIdArray.push(doc.id);   //adding new doc so array has old and new
    }
    await thisNote.addDocs(docIdArray);  //adding all docs to note hopefully

    //updated note values to send over:
    let resources = await Note.findByPk(noteId);  //updated note
    let docsThisNote = await resources.getDocs();  //docs for updated note
    const clientId = resources.clientId;
    const thisClient = await Client.findByPk(clientId);   //this particular client
    let allNotesThisClient = await Note.findAll({ where: { clientId: clientId } });
    let allDocsThisClient = [];
    for (let note of allNotesThisClient) {
      thisNoteId = note.id;       //one note's id
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
      let docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
      allDocsThisClient.push(docsForThisNote);
    }
    
    //re-render with new resources (updated note)
    res.render("viewNoteOrDoc", { resources, resourceType: "Note", success: "Association processed", allDocsThisClient, 
    thisClient, docsThisNote});
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};


//..............

// exports.viewNote = async (req, res) => {
//   try {
//     if (resources.clientId) {
//       let clientId = resources.clientId;
//       let thisClient = await Client.findByPk(clientId);
//     } else {
//       let allClients = await Client.findAll();    //for dropdown in view
//       // let clientList = [];    //for dropdown in view
//       // let thisClientId = [];    //for dropdown in view
//       // for (let client of allClients) {
//       //   clientId = client.id;
//       //   // clientId = 1;
//       //   let clientName = client.clientName;
//       //   clientList.push(clientName);
//       //   thisClientId.push(clientId);
//       // }
//       // let docList;
//       // let docListIds;
//       // let allDocsThisClient;
//       // let allDocsThisNote;
//       //     //all docs assoc with the client
//       //     if (clientId == 1) {      //temp
//       // //put in sepearate ifelse than finding client?
//       //       // let thisClient = await Client.findByPk(2);//clientIdd
//       //       let thisClientNotes = await Note.findAll({ where: { clientId: clientId } });  	//also works to give whole note
//       //       ///////// let resources = await thisClient.getNotes(); 	 //works at least to give whole note   

//       //       // let allNotesThisClient = await thisClient.getNotes();
//       //       console.log(thisClientNotes);
//       //       for (let note of thisClientNotes) {       //getting all docs associated to client through all client's notes
//       //         thisNoteId = note.id;
//       //         thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });
//       //         // allDocsThisNote = await thisNote.getDocs();
//       //         docList = await thisNote.getDocs();
//       //         //   // allDocsThisClient += allDocsThisNote;
//       //         //   // return allDocsThisClient;
//       //         console.log(docList);
//       //         //   // for (let docs of allDocsThisClient) {
//       //         //   //   docList.push(allDocsThisNote);
//       //         //   //   docList.push(allDocsThisNote);
//       //         //   // }
//       //         // }
//       //         // console.log(allDocsThisClient);
//       //         // // console.log("CRApTARDARY xxxx");
//       //         // // for (let docs of allDocsThisClient) {
//       //         // //   docId = doc.id;
//       //         // //   let docTitle = doc.title;
//       //         // //   docList.push(docTitle);
//       //         // //   docListIds.push(docId);
//       //         // // }
//       //       }
//       //     } else {  //else find all docs
//       //       docList = await Doc.findAll();    //for dropdown in view
//       //       //can just ref above rather than listing title and id sep?
//       //       // for (let doc of docList) {
//       //       //   docId = doc.id;
//       //       //   let docTitle = doc.title;
//       //       //   docList.push(docTitle);
//       //       //   docListIds.push(docId);
//       //       // }
//       //     }
//       //     // console.log(allDocsThisNote);
//     }
//     res.render("viewNoteOrDoc", {
//       resourceType: "Note", resources, thisClient, allClients,
//       allDocsThisClient, assoc1Id, assoc1Type,
//     });
//   } catch (error) {
//     console.log("HERE'S THE ERROR" + error);
//   }
// };

exports.deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const obsoleteNote = await Note.findByPk(id);
    if (!obsoleteNote) {
      res.status(404).send();
      return;
    }
    await obsoleteNote.destroy();
    res.json(obsoleteNote);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

// //need to fix
// exports.updateNote = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const note = req.body.note;
//         const existingNote = await Note.findByPk(id);
//         let docs = await Doc.findAll();
//         await existingNote.setDoc(docs[0])          //referring to the whole instance of a doc here - need to ref
//         // the id of the instance instead? also is it setDocs not docs?

//         // if (!existingNote) {
//         //     res.status(404).send();
//         //     return;
//         // }
//         // const updatedNote = await existingNote.update(note);
//         // res.json(updatedNote);
//     }
//     catch (error) {
//         console.log(error);
//     }
// };

// // await foo.addBars([bars1,bars2])

exports.updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const note = req.body;
    const existingNote = await Note.findByPk(id);
    if (!existingNote) {
      res.status(404).send();
      return;
    }
    const updatedNote = await existingNote.update(note);
    res.json(updatedNote);
  } catch (error) {
    console.log(error);
  }
};
