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
    // console.log(req.body);

    let resources = await Doc.create(req.body);
    let docId = resources.id;
    let noteId = req.body.noteId;   //passed in as noteId from viewNoteOrDoc(?)
    let thisNote = await Note.findByPk(noteId);
    let clientId = thisNote.clientId;
    let thisClient = await Client.findByPk(clientId);
    console.log(thisClient);
    let thisNoteDocs = await thisNote.getDocs();
    let docIdArray = [docId];   //array of doc ids for the note including new doc
    for (let doc of thisNoteDocs) {
      docIdArray.push(doc.id);
    };
    //--set/reset all docs to that note
    await thisNote.setDocs(docIdArray);

    // res.redirect("/");
    res.render("viewDoc", {
      resourceType: "Document", existingResource: false, resources, thisClient, thisNote
    });
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

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
    console.log("HERE'S THE ERROR: " + error);
  }
};

//need to update this code
exports.replaceDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = req.body;
    const existingDoc = await Note.findByPk(id);
    if (!existingDoc) {
      res.status(404).send();
      return;
    }
    const replacementDoc = await existingDoc.update(doc);
    res.json(replacementDoc);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};
