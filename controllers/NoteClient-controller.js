//for now, this controller for any queries involving NoteClient join table

// TO DO:

const Note = require("../db").Note;
const Client = require("../db").Client;
//


// exports.allNotesThisClient = async (req, res) => {
//   try {
//     // const clientId = req.body.clientId;
//     const clientId = 2; //temporary
//     let existingClient = await Client.findByPk(clientId);
//     let resources = await existingClient.getNotes(clientId); //array of notes assoc to that client
//     // for (let note of noteList) {
//     //   await noteList.findAll({ where: { noteId: noteId } });

//     //   let noteList = await existingClient.getNotes(clientId); //listing all associations for that client
//     //   console.log(noteList);
//     // }
//     res.send(resources);
//     // res.render("listNoteOrDoc", { resourceType: "Note", resources });
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

//just copied over
// exports.associateClientToNote = async (req, res) => {
//   try {
//     const clientId = req.body.clientId;
//     const noteId = req.body.noteId;
//     const existingClient = await Client.findByPk(clientId);
//     await existingClient.setNotes(noteId);
//     let newNote = await existingClient.getNotes(clientId);
//     let checkClientOnNote = [newNote[0].clientId];
//     res.send(
//       "Note " + noteId + " is now associated with client " + checkClientOnNote,
//     );
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };
