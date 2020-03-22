const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;

//can combine/but on notedoc page later if want
//works - just brings up the form with a get. then the next function will populate and post to same route
exports.newResource = async (req, res) => {
  console.log(req.params);
  let allClients = await Client.findAll();
  console.log(allClients);
  res.render('createNote', {
    action: 'notes', buttonText: 'Create Note', resourceType: "Note", allClients,
    isNote: true, existingResource: false
  });
};

exports.newNote = async (req, res) => {
  // coming from createNote.hbs /post request
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
    res.render("viewNote", {
      resourceType: "Note", existingResource: false, resources, allClients, thisClient, docsThisNote, allDocsThisClient,
      isNote: true
    });
    // res.redirect('/');
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.viewNote = async (req, res) => {
  try {
    let noteId = req.params.id;     //first access to the noteId
    let resources = await Note.findByPk(noteId);    //this particular note after client associated
    let allClients = await Client.findAll();
    let clientId = resources.clientId;
    const thisClient = await Client.findByPk(clientId);   //this particular client
    const clientNotes = await thisClient.getNotes();   //this particular client
    //--get/create array of noteIds for client including current note
    let docsThisNote = await resources.getDocs();       //gets docs associated to that individual note
    let allDocsThisClient = [];
    let tempDocIds = [];
    for (let note of clientNotes) {
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
    res.render("viewNote", {
      resourceType: "Note", existingResource: true, resources, allClients, thisClient, docsThisNote, allDocsThisClient
    });
    // res.redirect('/');
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
}

//coming from create note form in edit mode -createNote.hbs /post request
exports.updateNote = async (req, res) => {
  try {
    let noteId = req.body.id;
    await Note.upsert(req.body);          //returns false if updated, true if created
    let resources = await Note.findByPk(noteId);  //grabbing updated note
    let allClients = await Client.findAll();
    let clientId = resources.clientId;
    let thisClient = await Client.findByPk(clientId);

    //--get/create array of noteIds for client including current note
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
    res.render("viewNote", {
      resourceType: "Note", existingResource: true, resources, allClients, buttonText: "Update Note", thisClient,
      allDocsThisClient, docsThisNote, isNote: true
    });//need noteId here?

  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};



exports.addDocToNote = async (req, res) => {  //just assuming one doc added at a time
  //coming from  with docId, noteId (and on params), docAssociated hidden
  try {
    // processing with original note
    const clientId = req.body.clientId;
    const noteId = req.body.noteId;
    let docId = req.body.docId;
    docId = Number.parseInt(docId);
    let note = await Note.findByPk(noteId, { include: [Doc] });  //updated note
    let existingDocsForThisNote = await note.getDocs();
    let tempDocIdArray = [];
    if (docId) {                //if req comes in with docId, add to array. otherwise leave alone.
      tempDocIdArray = [docId]; // prevents error if try to re-add same doc
    }
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
    res.render("viewNote", {
      resources, resourceType: "Note", success: "Association processed", allDocsThisClient,
      thisClient, docsThisNote
    });
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

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
    //   let updatedNote = await existingNote.update(note); have to send it to form
    res.render('createNote', { resourceType: "Note", resources, existingResource: true, thisClient });
    // res.redirect('/notes/note:id');
  } catch (error) {
    console.log(error);
  }
};

