const Note = require("../db").Note;
const Doc = require("../db").Doc;
// const Client = require("../db").Client;

exports.associateDocsToNote = async (req, res) => {
  try {
    console.log(req.body);
    let { noteId, docId } = req.body; //example request body is { noteId: 1, docId:[2,3] }  note can't be array 
    //but docs can because many notes
    console.log("this is docID: " + docId + ", this is noteID: " + noteId);
    
    //associating the docs to the note:
    const existingNote = await Note.findByPk(noteId);
    await existingNote.addDocs(docId); //addDocs to add array of mult docs, addDoc to add one doc not in array
    
    //to get all of the docs associated with that particular note:
    //(like a one to many via fk except it is smart enough to know that it has to go through join table to access Doc)
    const updatedNote = await Note.findByPk(noteId,{include: [Doc]});
    res.send(updatedNote);
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.associateNotesToDoc = async (req, res) => {
    try {
      const { noteId, docId } = req.body;
      const existingDoc = await Doc.findByPk(docId);
      await existingDoc.addNotes(noteId);
      const updatedDoc = await Doc.findByPk(docId,{include: [Note]});
      res.send(updatedDoc);
    } catch (error) {
      console.log("HERE/'S THE ERROR" + error);
    }
  };
