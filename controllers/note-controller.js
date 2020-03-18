// TO DO:
//try changing to upsert on the associations?

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
  let allClients = Client.findAll();
  res.render('createNoteOrDoc', { action: 'notes', buttonText: 'Create Note', resourceType: "Note", allClients });
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


exports.newNote = async (req, res) => {
  // coming from createNoteOrDoc.hbs /post request
  try {
    let reqBodyObj = req.body;
    // if (req.body.id) { delete reqBodyObj["id"]; }
    let newNote = await Note.create(reqBodyObj);

    let noteId = newNote.id;     //first access to the noteId
    let allClients = await Client.findAll();//needed?

    //----------begin add client functionality
    const clientId = req.body.clientId;
        //--find existing client and notes attached to that client
    const thisClient = await Client.findByPk(clientId);   //this particular client
    const clientNotes = await thisClient.getNotes();   //this particular client
    //--get/create array of noteIds for client including current note
    let noteIdArray = [noteId];
    for (let note of clientNotes) {
      noteIdArray.push(note.id);
    };
    //--set/reset all notes to that client
    await thisClient.setNotes(noteIdArray);
    //--grab updated note then all docs attached to that note to send on
    let resources = await Note.findByPk(noteId);    //this particular note after client associated
    let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note
    //--grab all notes for that client after added the note
    const updatedClientNotes = await thisClient.getNotes();
    //--get find each note including docs then pull docs, adding all to an array
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of updatedClientNotes) {
      thisNoteId = note.id;       //this note's id
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
      docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let docId of finalDocIds) {              //getting the whole docs not ids
      let doc = await Doc.findByPk(docId);
      allDocsThisClient.push(doc);
    }
    res.render("viewNoteOrDoc", {
      resourceType: "Note", existingResource: false, resources, allClients, thisClient, docsThisNote, allDocsThisClient
    });
    // res.redirect('/');
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

//function deprecated - combined with main note creation (newNote)
// exports.addNoteToClient = async (req, res) => {
//   //--from viewNewNote.hbs with noteId (via params and hidden noteId for now), clientId
//   try {
//     const clientId = req.body.clientId;
//     const noteId = req.body.noteId;   //or could do req.params.noteId now i think
//     //--find existing client and notes attached to that client
//     const thisClient = await Client.findByPk(clientId);   //this particular client
//     const clientNotes = await thisClient.getNotes();   //this particular client
//     //--get/create array of noteIds for client including current note
//     let noteIdArray = [noteId];
//     for (let note of clientNotes) {
//       noteIdArray.push(note.id);
//     };
//     //--set/reset all notes to that client
//     await thisClient.setNotes(noteIdArray);

//     //--grab updated note then all docs attached to that note to send on
//     let resources = await Note.findByPk(noteId);    //this particular note after client associated
//     let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note

//     //--grab all notes for that client after added the note
//     const updatedClientNotes = await thisClient.getNotes();
//     //--get find each note including docs then pull docs, adding all to an array
//     let allDocsThisClient = [];
//     let tempDocIds = [];
//     for (let note of updatedClientNotes) {
//       thisNoteId = note.id;       //this note's id
//       thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
//       docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
//       for (let doc of docsForThisNote) {
//         let docId = doc.id;
//         tempDocIds.push(docId);
//       }
//     }
//     let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
//     for (let docId of finalDocIds) {              //getting the whole docs not ids
//       let doc = await Doc.findByPk(docId);
//       allDocsThisClient.push(doc);
//     }

//     res.render("viewNoteOrDoc", {
//       resourceType: "Note", existingResource: true, resources, docsThisNote, allDocsThisClient,
//       thisClient
//     });
//   } catch (error) {
//     console.log("HERE'S THE ERROR" + error);
//   }
// };

exports.addDocToNote = async (req, res) => {  //just assuming one doc added at a time
  //coming from viewNoteOrDoc with docId, noteId (and on params), docAssociated hidden
  try {
    // processing with original note
    const clientId = req.body.clientId;
    const noteId = req.body.noteId;
    let docId = req.body.docId;
    docId = Number.parseInt(docId);
    let note = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let existingDocsForThisNote = await note.getDocs();
    let tempDocIdArray = [docId]; // let docIdArray = docsForThisNote.id;  //getting ids already on note
    for (let doc of existingDocsForThisNote) {
      let tempDocId = doc.id;
      tempDocIdArray.push(tempDocId);
    }
    let docIdArray = [...new Set(tempDocIdArray)];   //getting rid of duplicates
    console.log(docIdArray);
    let thisNote = await Note.findByPk(noteId);
    await thisNote.setDocs(docIdArray);  //adding all old and new docs to note. if not in array, will be removed.

    let thisClient = await Client.findByPk(clientId);   //this particular client
    //updated note values to send over:
    let resources = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let docsThisNote = await resources.getDocs();  //docs for updated note

    let updatedClientNotes = await thisClient.getNotes();
    //--get find each note including docs then pull docs, adding all to an array
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of updatedClientNotes) {
      thisNoteId = note.id;       //this note's id
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
      docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let thisDocId of finalDocIds) {              //getting the whole docs not ids
      let doc = await Doc.findByPk(thisDocId);
      allDocsThisClient.push(doc);
    }
    // for (let thisDocId of finalDocIds) {              //getting the whole docs not ids
    //   let doc = await Doc.findByPk(thisDocId);
    //   if (thisDocId === docId) {
    //     console.log("association already exists");
    //   } else { allDocsThisClient.push(doc); }
    // }
    //re-render with new resources (updated note)
    res.render("viewNoteOrDoc", {
      resources, resourceType: "Note", success: "Association processed", allDocsThisClient,
      thisClient, docsThisNote
    });
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};


// //nothing happens here. 
// exports.finalView = async (req, res) => {
//   //--from viewNewNote.hbs with noteId (via params and hidden noteId for now), clientId
//   try {
//     const clientId = req.body.clientId;
//     const noteId = req.body.noteId;   //or could do req.params.noteId now i think
//     //--find existing client and notes attached to that client
//     const thisClient = await Client.findByPk(clientId);   //this particular client

//     //--grab updated note then all docs attached to that note to send on
//     let resources = await Note.findByPk(noteId);    //this particular note after client associated
//     let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note

//     res.redirect("/");
//   } catch (error) {
//     console.log("HERE'S THE ERROR" + error);
//   }
// };


//maybe deprecated - instead of trying to give option of only docs for the client in question, will try listing all docs
//along with their associated client so the code is simpler at least hopefully
// exports.addNoteToClient = async (req, res) => {
//   //from viewNewNote.hbs with noteId (via params and hidden noteId for now), clientId
//   try {
//     // on the note, clientId is created but null. so think need to upsert
//     const clientId = req.body.clientId;
//     const noteId = req.body.noteId;   //or could do req.params.noteId now i think

//     const thisClient = await Client.findByPk(clientId);   //this particular client
//     await thisClient.setNotes(noteId);

//     let resources = await Note.findByPk(noteId);    //this particular note after client associated
//     let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note

//     let allNotesThisClient = await thisClient.getNotes(clientId);
//     let allDocsThisClient = [];// = allNotesThisClient.getDocs;

//     // let thisClientNotes = await Note.findAll({ where: { clientId: clientId } });
//     for (let note of allNotesThisClient){
//       let id = note.id;
//     let thisNote = await Note.findByPk(id, { include: [Doc] });
//     let theDocs = await thisNote.getDocs();
//     allDocsThisClient.push(theDocs);
//     }

//     // let allNotesThisClient = await Note.findAll({ where: { clientId: clientId } });
//     // for (let note of allNotesThisClient) {
//     //   thisNoteId = note.id;       //one note's id
//     //   thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
//     //   let docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
//     //   allDocsThisClient.push(docsForThisNote);
//     // }
//     let allClients = Client.findAll();
//     res.render("viewNoteOrDoc", {
//       resourceType: "Note", existingResource: true, resources, allClients, docsThisNote, allDocsThisClient,
//       thisClient, allNotesThisClient
//     });
//   } catch (error) {
//     console.log("HERE'S THE ERROR" + error);
//   }
// };


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
    console.log(req.params);
    const noteId = req.params.id;
    const obsoleteNote = await Note.findByPk(noteId);
    let title = obsoleteNote.title;
    if (!obsoleteNote) {
      res.status(404).send();
      return;
    }
    await obsoleteNote.destroy();
    console.log(title + " was deleted");
    // res.render('listNotesOrDocs', { resourceType: "Note" });
    res.redirect('/listAllResources');
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

// //need to fix
// exports.updateNote = async (req, res) => {
//     try {
//         let id = req.params.id;
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

exports.editNote = async (req, res) => {
  try {
    let id = req.params.id;
    let resources = await Note.findByPk(id);
    if (!resources) {
      res.status(404).send();
      return;
    }
    //   let updatedNote = await existingNote.update(note); have to send it to form
    res.render('createNoteOrDoc', { resourceType: "Note", resources, existingResource: true });
    // res.redirect('/notes/note:id');
  } catch (error) {
    console.log(error);
  }
};

exports.updateNote = async (req, res) => {
  // coming from createNoteOrDoc.hbs /post request
  try {
    //unless we move client selection to create from view will have problem with client association
    // let note = req.body;

    let updatedNote = await Note.upsert(req.body);
    let resources = updatedNote;
    let allClients = await Client.findAll();
    res.render("viewNoteOrDoc", {
      resourceType: "Note", existingResource: true, resources, allClients, buttonText: "Update Note"
    });//need noteId here?
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};
