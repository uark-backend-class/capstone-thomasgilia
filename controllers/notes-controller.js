const Note = require('../db').Note;
// const arrayOfNotes = [];
// let id = 1;

//working insomnia version
// exports.getAll = (req, res) => {
//     res.json(arrayOfNotes);
// }
exports.getAllNotes = async (req, res) => {
    try {
        let notes = await Note.findAll();
        res.json(notes);
        console.log(notes);
    }
    catch (error) {
        console.log("HERE/'S THE ERROR" + error);
    }
}

// working insomnia version
// exports.newNote = async (req, res) => {
//     let note = req.body;
//     note.id = id;
//     arrayOfNotes.push(note);
//     id++;
//     res.json(arrayOfNotes);
// }

exports.newNote = async (req, res) => {
    try {
        let newNote = await Note.create(req.body);
        res.json(newNote);
        console.log(newNote);
    }
    catch (error) {
        console.log("HERE/'S THE ERROR" + error);
    }
}