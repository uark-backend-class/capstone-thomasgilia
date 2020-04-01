const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;

exports.newResource = async (req, res) => {
  let allClients = await Client.findAll();
  res.render('createNote', {
    action: 'notes', buttonText: 'Create Note', resourceType: "Note", allClients,
    isNote: true, existingResource: false
  });
};

exports.newNote = async (req, res) => {
  try {
    let reqBodyObj = req.body;
    let newNote = await Note.create(reqBodyObj);
    let noteId = newNote.id;
    let allClients = await Client.findAll();
    //----------begin add client functionality
    const clientId = req.body.clientId;
    const thisClient = await Client.findByPk(clientId);
    const clientNotes = await thisClient.getNotes();
    let noteIdArray = [noteId];
    for (let note of clientNotes) {
      noteIdArray.push(note.id);
    };
    //--set/reset all notes to that client
    await thisClient.setNotes(noteIdArray);
    let resources = await Note.findByPk(noteId);
    let docsThisNote = await resources.getDocs();
    const updatedClientNotes = await thisClient.getNotes();
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of updatedClientNotes) {
      thisNoteId = note.id;
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });
      docsForThisNote = await thisNote.getDocs();
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let docId of finalDocIds) {
      let doc = await Doc.findByPk(docId);
      allDocsThisClient.push(doc);
    }
    res.render("viewNote", {
      resourceType: "Note", existingResource: false, resources, allClients, thisClient, docsThisNote, allDocsThisClient,
      isNote: true
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN NEWNOTE: " + error);
  }
};

exports.viewNote = async (req, res) => {
  try {
    let noteId = req.params.id;
    let resources = await Note.findByPk(noteId);
    let allClients = await Client.findAll();
    let clientId = resources.clientId;
    const thisClient = await Client.findByPk(clientId);
    const clientNotes = await thisClient.getNotes();
    let docsThisNote = await resources.getDocs();
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of clientNotes) {
      thisNoteId = note.id;
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });
      docsForThisNote = await thisNote.getDocs();
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let docId of finalDocIds) {
      let doc = await Doc.findByPk(docId);
      allDocsThisClient.push(doc);
    }
    res.render("viewNote", {
      resourceType: "Note", existingResource: true, resources, allClients, thisClient, docsThisNote, allDocsThisClient
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN VIEWNOTE" + error);
  }
}

exports.updateNote = async (req, res) => {
  try {
    let noteId = req.body.id;
    await Note.upsert(req.body);
    let resources = await Note.findByPk(noteId);
    let allClients = await Client.findAll();
    let clientId = resources.clientId;
    let thisClient = await Client.findByPk(clientId);
    let docsThisNote = await resources.getDocs();
    //--grab all notes for that client after added the note
    const updatedClientNotes = await thisClient.getNotes();
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of updatedClientNotes) {
      thisNoteId = note.id;
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });
      docsForThisNote = await thisNote.getDocs();
      for (let doc of docsForThisNote) {
        let docId = doc.id;
        tempDocIds.push(docId);
      }
    }
    let finalDocIds = [...new Set(tempDocIds)];   //getting rid of duplicates
    for (let docId of finalDocIds) {
      let doc = await Doc.findByPk(docId);
      allDocsThisClient.push(doc);
    }
    res.render("viewNote", {
      resourceType: "Note", existingResource: true, resources, allClients, buttonText: "Update Note", thisClient,
      allDocsThisClient, docsThisNote, isNote: true
    });

  } catch (error) {
    console.log("HERE'S THE ERROR IN UPDATENOTE: " + error);
  }
};

exports.addDocToNote = async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const noteId = req.body.noteId;
    let docId = req.body.docId;
    docId = Number.parseInt(docId);
    let note = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let existingDocsForThisNote = await note.getDocs();
    let tempDocIdArray = [];
    if (docId) {
      tempDocIdArray = [docId]; // prevents error if try to re-add same doc
    }
    for (let doc of existingDocsForThisNote) {
      let tempDocId = doc.id;
      tempDocIdArray.push(tempDocId);
    }
    let docIdArray = [...new Set(tempDocIdArray)];   //getting rid of duplicates
    let thisNote = await Note.findByPk(noteId);
    await thisNote.setDocs(docIdArray);  //adding all old and new docs to note. if not in array, will be removed.

    let thisClient = await Client.findByPk(clientId);
    let resources = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let docsThisNote = await resources.getDocs();

    let updatedClientNotes = await thisClient.getNotes();
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of updatedClientNotes) {
      thisNoteId = note.id;
      thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });
      docsForThisNote = await thisNote.getDocs();
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
    let thisDoc = await Doc.findByPk(docId, { include: [Note] });
    let notesThisDoc = await thisDoc.getNotes();
    let tempNoteIdArray = [];
    for (let note of notesThisDoc) {
      tempNoteIdArray.push(note.id);
    }
    console.log(tempNoteIdArray);
    res.render("viewNote", {
      resources, resourceType: "Note", success: "Association processed", allDocsThisClient,
      thisClient, docsThisNote
    });
  } catch (error) {
    console.log("HERE'S THE ERROR IN ADDDOCTONOTE: " + error);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const obsoleteNote = await Note.findByPk(noteId);
    let title = obsoleteNote.title;
    if (!obsoleteNote) {
      res.status(404).send();
      return;
    }
    await obsoleteNote.destroy();
    console.log(`Note "${title}" was deleted`);
    let resources = await Note.findAll();
    res.render('listNotesOrDocs', { resourceType: "Note", resources, isNote: true });

  } catch (error) {
    console.log("HERE'S THE ERROR IN DELETENOTE: " + error);
  }
};

exports.editNote = async (req, res) => {
  try {
    let id = req.params.id;
    let resources = await Note.findByPk(id);
    let thisClientId = resources.clientId;
    let thisClient = await Client.findByPk(thisClientId);
    if (!resources) {
      res.status(404).send();
      return;
    }
    res.render('createNote', { resourceType: "Note", resources, existingResource: true, thisClient });
  } catch (error) {
    console.log("HERE'S THE ERROR IN EDITNOTE: " + error);
  }
};

