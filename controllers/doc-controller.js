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

exports.newDoc = async (req, res) => {
  try {
    let resources = await Doc.create(req.body);
    let docId = resources.id;
    let noteId = req.body.noteId; 
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
      resourceType: "Document", existingResource: false, resources, thisClient, thisNote, noteId,
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
    let docId = req.params.id;
    let resources = await Doc.findByPk(docId, { include: [Note] });
    let notesThisDoc = await resources.getNotes();
    let clientId;
    for (let note of notesThisDoc) {
      clientId = note.clientId;
    }
    let thisClient = await Client.findByPk(clientId);
    let allClients = await Client.findAll();
    res.render("viewDoc", {
      resourceType: "Document", existingResource: true, resources, allClients, thisClient, notesThisDoc
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN VIEWDOC: " + error);
  }
}

exports.deleteDoc = async (req, res) => {
  try {
    let allClients = Client.findAll();
    let obsoleteDocId = req.body.obsoleteDocId;
    console.log(obsoleteDocId);
    const obsoleteDoc = await Doc.findByPk(obsoleteDocId);
    await obsoleteDoc.destroy();
    const clientId = req.body.clientId;
    let thisClient = await Client.findByPk(clientId);
    const noteId = req.body.noteId;
    let resourcesTemp = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let docsThisNote = await resourcesTemp.getDocs();  //docs for updated note

    let notesThisClient = await thisClient.getNotes();
    //--get find each note including docs then pull docs, adding all to an array
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of notesThisClient) {
      thisNoteId = note.id;
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
      docsForThisNote = await thisNote.getDocs();       //gets docs associated to that individual note
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let thisDocId of finalDocIds) {
      let doc = await Doc.findByPk(thisDocId);
      allDocsThisClient.push(doc);
    }
    let resources = await Note.findByPk(noteId);
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
    let tempResources = await Doc.findByPk(docId, { include: [Note] });
    let notesThisDoc = await tempResources.getNotes();
    let resources = await Doc.findByPk(docId);
    let clientId;
    for (let note of notesThisDoc) {
      clientId = note.clientId;
      noteId = note.id;
    }
    let thisClient = await Client.findByPk(clientId);
    if (!resources) {
      res.status(404).send();
      return;
    }
    res.render('createDoc', { resourceType: "Document", resources, existingResource: true, thisClient, notesThisDoc, noteId });
  } catch (error) {
    console.log("HERE'S THE ERROR IN EDITDOC: " + error);
  }
};

exports.updateDoc = async (req, res) => {
  try {
    let docId = req.body.id;
    await Doc.upsert(req.body);
    let tempResources = await Doc.findByPk(docId, { include: [Note] });  //grabbing updated doc
    let notesThisDoc = await tempResources.getNotes();
    let clientId;
    let noteId;
    for (let note of notesThisDoc) {
      clientId = note.clientId;
      noteId = note.id;
    }
    let thisClient = await Client.findByPk(clientId);
    let allClients = await Client.findAll();
    let resources = await Doc.findByPk(docId, { include: [Note] });  //grabbing updated doc
    res.render("viewDoc", {
      resourceType: "Document", existingResource: true, resources, allClients, thisClient, notesThisDoc, noteId
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN UPDATEDOC: " + error);
  }
};
