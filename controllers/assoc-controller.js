//TO DO:
//see 'later' down below. for now, keep assoc sep from join controller files then can decide on whether to keep
//assoc controller with a unified association export, or if want to split the associations into their respective
//join controller file

const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;
const User = require("../db").User;

//Many(Notes)-To-Many(Docs)//
exports.associateDocsToNote = async (req, res) => {
  try {
    // console.log(req.body);
    let { noteId, docId } = req.body; //example request body is { noteId: 1, docId:[2,3] }  note can't be array
    //but docs can because many notes
    console.log("this is docID: " + docId + ", this is noteID: " + noteId);
    let docIdArray = [docId];
    console.log("this is docIDArray:");
    console.log(docIdArray);
    //associating the docs to the note:
    // const existingNote = await Note.findByPk(noteId);
    // await existingNote.addDocs(docIdArray); //addDocs to add array of mult docs, addDoc to add one doc not in array

    //to get all of the docs associated with that particular note:
    //(like a one to many via fk except it is smart enough to know that it has to go through join table to access Doc)
    const updatedNote = await Note.findByPk(noteId, { include: [Doc] });
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
    const updatedDoc = await Doc.findByPk(docId, { include: [Note] });
    res.send(updatedDoc);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
//deprecated from notecontroller
// // exports.updateNote = async (req, res) => {
// //   req.body.clientId = req.client.id;
// //   await Student.upsert(req.body);  //  { firstName: "Bob", lastName: "Smith", userId: 2, phone: "555-5555" }
// //   res.redirect('/');
// // }
// exports.associateDocIdForThisNote = async (req, res) => {
//   try {
//     const thisNoteId = req.params.id;
//     let docId = 2; //mock Id for trying out - real life pull from form/search
//     const existingNote = await Note.findByPk(thisNoteId);
//     console.log(existingNote);
//     // let docs = await Doc.findAll();
//     let targetDoc = await Doc.findByPk(docId);
//     console.log(targetDoc);
//     // await existingNote.setDoc(docs[0])
//     // const idAssociation = {
//     //   noteId: existingNote.id, //name of fields in associating table
//     //   docId: targetDoc.id,
//     // };
//     // //these 4 lines at least got a mention of notedoc in sql in terminal
//     // const newAssociation = await NoteDoc.create(
//     //   idAssociation,
//     //     // { w: 1 },
//     //   { returning: true },
//     // ); //add {w:1},{returning: true}?
//     // return res.status(200);
//     // note.addDoc(doc[1]);
//     // if (!existingNote) {
//     //     res.status(404).send();
//     //     return;
//     // }
//     // const updatedNote = await existingNote.update(note);
//     // res.json(nd);
//   } catch (error) {
//     console.log(error);
//   }
// };

//Many(Clients)-To-Many(Users)//
exports.associateClientsToUser = async (req, res) => {
  try {
    const { uClientId, userId } = req.body;
    const existingUser = await User.findByPk(userId);
    await existingUser.addClients(uClientId);
    const updatedUser = await User.findByPk(userId, { include: [Client] });
    res.send(updatedUser);
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.associateUsersToClient = async (req, res) => {
  try {
    const { uClientId, userId } = req.body;
    const existingClient = await User.findByPk(userId);
    await existingClient.addUser(userId);
    const updatedClient = await Client.findByPk(uClientId, { include: [User] });
    res.send(updatedClient);
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

//--One(Client)-To-Many(Notes)--//

//doesnt work
// exports.associateClientToNote = async (req, res) => {
//   try {
//     const clientId = req.body.clientId;
//     const existingClient = await Client.findByPk(clientId);
//     // const noteIdArray = [req.body.noteId]; //our array of notes from request - may be one value but still array
//     for (let id of noteIdArray) {           //making the association for each id
//       await existingClient.setNotes(id);
//     }
//     res.send("Note(s) " + noteIdArray + " now associated with client " + clientId);
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

//working version
exports.associateClientToNote = async (req, res) => {
try {
  const clientId = req.body.clientId;
  const noteId = req.body.noteId;
  const existingClient = await Client.findByPk(clientId);
  await existingClient.setNotes(noteId);
  let newNote = await existingClient.getNotes(clientId);
  let checkClientOnNote = [newNote[0].clientId];
  res.send("Note " + noteId + " is now associated with client " + checkClientOnNote);
} catch (error) {
  console.log("HERE'S THE ERROR: " + error);
}
}

// //not working
// exports.associateClientToNote = async (req, res) => {
//   try {
//     const clientId = req.body.clientId;
//     const existingClient = await Client.findByPk(clientId);
//     const noteIdArray = [req.body.noteId]; //our array of notes from request - may be one value but still array
//     for (let id of noteIdArray) {
//       //making the association for each id
//       await existingClient.setNotes(id);
//     }
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

//---FOR LATER---//
//later can think about combining these. Thoughts:
//grab input from form in browser - the 'source' would be a single id and the 'targets' would be an array so can use
//sourceInstance.addTargets(targetId);  problem may be for a single target, it wont like the addTargets being a single
//value in array? may need to have an if based on array length
//anyway, then there could be just one export function like this roughly:
//exports.associateTargetsToSource =....
//targetsIds = [brought in variable name]
//sourceId = [brought in variable name]

//   once associate existing client to existing note, can add feature to deal with new note etc
//   const noteId = req.params.id;
//   if (note){
//     const existingNote = await Note.findByPk(noteId);
//   }
//   else if (!note){
//             const note = req.body;

//             let clientId = await req.body;
