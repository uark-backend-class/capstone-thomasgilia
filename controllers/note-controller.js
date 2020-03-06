// TO DO:
// practice query (next lines) then move on to creating views/forms/etc then build more functionality
//get all notes for a client
//get all docs for a client, via notes

const Note = require("../db").Note;
const Doc = require("../db").Doc; //just for associating docs - take out if doesn't work
const Client = require("../db").Client;

exports.getAllNotes = async (req, res) => {
  try {
    let notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

//this or createNOteOrDOc.hbs is not working
exports.newNote = async (req, res) => {
  try {
    let newNote = await Note.create(req.body);
    res.render("createNoteOrDoc", {
      action: "newNote",
      buttonText: "Create Note", //need to add {newNote}?
      newNote,
    });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

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
