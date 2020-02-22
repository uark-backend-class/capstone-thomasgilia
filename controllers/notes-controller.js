const arrayOfNotes = [];
let id = 1;

exports.getAll = (req, res) => {
    res.json(arrayOfNotes);
}

exports.newNote = (req, res) => {
    let note = req.body;
    note.id = id;
    arrayOfNotes.push(note);
    id++;
    res.json(arrayOfNotes);
}
