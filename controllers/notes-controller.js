// TO DO:
// figure out 'set' function  in simple export then either add to update export or do separate 'associate' export

const Note = require("../db").Note;
const Doc = require("../db").Doc; //just for associating docs - take out if doesn't work
const NoteDoc = require("../db").NoteDoc; //need this?

exports.getAllNotes = async (req, res) => {
  try {
    let notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

exports.newNote = async (req, res) => {
  try {
    let newNote = await Note.create(req.body);
    res.json(newNote);
    console.log(newNote);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
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

// await foo.addBars([bars1,bars2])

exports.associateDocIdForThisNote = async (req, res) => {
  try {
    const thisNoteId = req.params.id;
    let docId = 2; //mock Id for trying out - real life pull from form/search
    const existingNote = await Note.findByPk(thisNoteId);
    console.log(existingNote);
    // let docs = await Doc.findAll();
    let targetDoc = await Doc.findByPk(docId);
    console.log(targetDoc);
    // await existingNote.setDoc(docs[0])
    // const idAssociation = {
    //   noteId: existingNote.id, //name of fields in associating table
    //   docId: targetDoc.id,
    // };
    // //these 4 lines at least got a mention of notedoc in sql in terminal
    // const newAssociation = await NoteDoc.create(
    //   idAssociation,
    //     // { w: 1 },
    //   { returning: true },
    // ); //add {w:1},{returning: true}?
    // return res.status(200);
    // note.addDoc(doc[1]);
    // if (!existingNote) {
    //     res.status(404).send();
    //     return;
    // }
    // const updatedNote = await existingNote.update(note);
    // res.json(nd);
  } catch (error) {
    console.log(error);
  }
};

// //working update - before modification to try out assigning docs to the note
// exports.updateNote = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const note = req.body;
//         const existingNote = await Note.findByPk(id);
//         if (!existingNote) {
//             res.status(404).send();
//             return;
//         }
//         const updatedNote = await existingNote.update(note);
//         res.json(updatedNote);
//     }
//     catch (error) {
//         console.log(error);
//     }
// };

// //many-to-many association test
// //foo.addBars([bar1, bar2]);
// exports.setDocAssoc = async (req, res) => {
//     try {
//         let docId = await req.body;
//         // let docId = req.body.associatedDocId;
//         res.json(docId);
//         // console.log(await Notes.addDocs([doc[0]]));
//         // console.log(await Notes.addDocs(set));
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
