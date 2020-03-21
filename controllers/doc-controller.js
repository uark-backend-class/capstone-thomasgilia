const Note = require("../db").Note;
const Doc = require("../db").Doc; //just for associating docs - take out if doesn't work
const Client = require("../db").Client;

exports.getAllDocs = async (req, res) => {
  try {
    let docs = await Doc.findAll();
    res.json(docs);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

exports.newDoc = async (req, res) => {
  try {
    let newDoc = await Doc.create(req.body);
    res.json(newDoc);
    console.log(newDoc);
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

// //prob dep
// exports.deleteDocPage = async (req, res) => {
//   try {
//     console.log(req.params)
//     // const id = req.params.id;
//     // const obsoleteDoc = await Doc.findByPk(id);
//     // if (!obsoleteDoc) {
//     //   res.status(404).send();
//     //   return;
//     // }
//     // await obsoleteDoc.destroy();
//     // res.json(obsoleteDoc);
//     res.render("removeDocs");
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

exports.deleteDoc = async (req, res) => {
  try {
    // processing with original note
    let obsoleteDocId = req.body.obsoleteDocId;
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
    res.render("viewNoteOrDoc", {
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
