const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;

//render createDoc to create doc
exports.newResource = async (req, res) => {
  let noteId = req.params.id;
  let thisNote = await Note.findByPk(noteId);
  let clientId = thisNote.clientId;
  let thisClient = await Client.findByPk(clientId);
  let allClients = await Client.findAll();
  res.render('createDoc', {
    action: 'docs', buttonText: 'Create Document', resourceType: "Document", allClients,
    existingResource: false, thisClient, noteId, thisNote
  });
};

//create doc after click button from viewDoc
exports.newDoc = async (req, res) => {
  try {
    let resources = await Doc.create(req.body);
    let docId = resources.id;
    let noteId = req.body.noteId;   //passed in as noteId from viewNoteOrDoc(?)
    let tempThisNote = await Note.findByPk(noteId);
    let clientId = tempThisNote.clientId;
    let thisClient = await Client.findByPk(clientId);
    let thisNoteDocs = await tempThisNote.getDocs();
    let docIdArray = [docId];   //array of doc ids for the note including new doc
    for (let doc of thisNoteDocs) {
      docIdArray.push(doc.id);
    };
    //--set/reset all docs to that note
    await tempThisNote.setDocs(docIdArray);
    let thisNote = await Note.findByPk(noteId);    //updated note
    let thisDoc = await Doc.findByPk(docId, { include: [Note] });
    let notesThisDoc = await thisDoc.getNotes();
   
    res.render("viewDoc", {
      resourceType: "Document", existingResource: false, resources, thisClient, thisNote,
      notesThisDoc
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN NEWDOC: " + error);
  }
};

//redirect after click new doc button
exports.rerouteNewDoc = async (req, res) => {
  try {
    res.send("Before creating/uploading a new Document, please find (or create new) Note containing Document's meta data");
  } catch (error) {
    console.log("HERE'S THE ERROR IN REROUTENEWDOC: " + error);
  }
};

exports.viewDoc = async (req, res) => {
  try {
    //we're going to assume for now that a doc will only have one note
    let docId = req.params.id;
    let resources = await Doc.findByPk(docId, { include: [Note] });
    let notesThisDoc = await resources.getNotes();
    // let thisNote;
    let clientId;
    // if (notesThisDoc.length > 1) {
    //   console.log("additional notes associated to the doc")
    // } else { thisNote = docNotes[0] }
    let thisNote = await
    for (let note of notesThisDoc) {  
      clientId = note.clientId;
    }
    let thisClient = await Client.findByPk(clientId);
    let allClients = await Client.findAll();
    res.render("viewDoc", {
      resourceType: "Document", existingResource: true, resources, allClients, thisClient, notesThisDoc,
      thisNote
    });
    // res.redirect('/');
  } catch (error) {
    console.log("HERE'S THE ERROR IN VIEWDOC: " + error);
  }
}


exports.deleteDoc = async (req, res) => {
  try {
    // processing with original note
    let allClients = Client.findAll();
    let obsoleteDocId = req.body.obsoleteDocId;
    console.log(obsoleteDocId);
    const obsoleteDoc = await Doc.findByPk(obsoleteDocId);
    await obsoleteDoc.destroy();

    const clientId = req.body.clientId;
    let thisClient = await Client.findByPk(clientId);   //this particular client

    const noteId = req.body.noteId;
    let resources = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let docsThisNote = await resources.getDocs();  //docs for updated note

    let notesThisClient = await thisClient.getNotes();
    //--get find each note including docs then pull docs, adding all to an array
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of notesThisClient) {
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
    res.render("viewNote", {
      resourceType: "Note", existingResource: true, resources, allClients, thisClient, docsThisNote, allDocsThisClient
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN DELETEDOC: " + error);
  }
};

exports.editDoc = async (req, res) => {
  try {
    let docId = req.params.id;
    let resources = await Doc.findByPk(docId, { include: [Note] });  //grabbing updated doc
    let notesThisDoc = await resources.getNotes();
    // let thisNote;
    let clientId;
    // if (docNotes.length > 1) {
    //   console.log("additional notes associated to the doc")
    // } else { thisNote = docNotes[0] }
    // for (let note of docNotes) {
    //   clientId = note.clientId;
    // }
    let thisClient = await Client.findByPk(clientId);
    if (!resources) {
      res.status(404).send();
      return;
    }
    res.render('createDoc', { resourceType: "Document", resources, existingResource: true, thisClient, notesThisDoc });
  } catch (error) {
    console.log("HERE'S THE ERROR IN EDITDOC: " + error);
  }
};

//coming from create note form in edit mode -createNote.hbs /post request
exports.updateDoc = async (req, res) => {
  try {
    let docId = req.body.id;
    await Doc.upsert(req.body);          //returns false if updated, true if created
    let resources = await Doc.findByPk(docId, { include: [Note] });  //grabbing updated doc
    let docNotes = await resources.getNotes();
    let thisNote;
    let clientId;
    if (docNotes.length > 1) {
      console.log("additional notes associated to the doc")
    } else { thisNote = docNotes[0] }
    for (let note of docNotes) {
      clientId = note.clientId;
    }
    let thisClient = await Client.findByPk(clientId);
    let allClients = await Client.findAll();

    res.render("viewDoc", {
      resourceType: "Document", existingResource: true, resources, allClients, thisClient, thisNote
    });
    //was trying to fix...
    // let docId = req.body.id;
    // await Doc.upsert(req.body);          //returns false if updated, true if created
    // let resources = await Doc.findByPk(docId, { include: [Note] });  //grabbing updated doc
    // let notesThisDoc = await resources.getNotes();
    // let thisNote = docNotes;
    // let clientId;
    // // let multiNotes;
    // // console.log(docNotes.length);
    // // if (docNotes.length > 1) {
    // //   multiNotes = true;
    // // }
    // for (let note of docNotes) {
    //   clientId = note.clientId;
    // }
    // let thisClient = await Client.findByPk(clientId);
    // let allClients = await Client.findAll();

    // res.render("viewDoc", {
    //   resourceType: "Document", existingResource: true, resources, allClients, thisClient, notesThisDoc 
    //   //thisNote
    // });
  } catch (error) {
    console.log("HERE'S THE ERROR IN UPDATEDOC: " + error);
  }
};
