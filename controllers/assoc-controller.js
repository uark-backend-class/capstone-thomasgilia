//TO DO:
//see 'later' down below. for now, keep assoc sep from join controller files then can decide on whether to keep
//assoc controller with a unified association export, or if want to split the associations into their respective
//join controller file

const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;
const User = require("../db").User;

// //deprecated
// //render associations form
// exports.associationsPage = (req, res) => {
//   res.render('associations', { action: 'associations', buttonText: 'Create Association' });
// };
// // exports.associations = async (req, res, next) => {
// //   try {
// //     let { assoc1type, assoc1Id, assoc2type, assoc2Id } = req.body;
// //take in association request, send to next controller based on selection, send specific selection values (i.e. note 1,
// //client 2) to next controller. 

exports.associations = async (req, res, next) => {
  try {
    // let { assoc1type, assoc1Id, assoc2type, assoc2Id } = req.body;
    if (assoc1type == "note" && assoc2type == "doc(s)") {
      res.render("/viewNoteOrDoc",{assoc1Id,assoc1type});   //pass orig id and type back to view to render orig resource view
    }

    //   exports.associateNotesToDoc = async (req, res) => {
    //     exports.associateDocsToNote = async (req, res) => {
    //       exports.associateUsersToClient = async (req, res) => {    //works
    //         exports.associateClientToNote = async (req, res) => {
    // router.route("/associations").get(assocController.associations);  //works in insomnia
    // router.route("/associateNotesToDoc").put(assocController.associateNotesToDoc);  //works in insomnia
    // router.route("/associateClientsToUser").put(assocController.associateClientsToUser);  //working insomnia
    // router.route("/associateUsersToClient").put(assocController.associateUsersToClient);  //working insomnia
    // router.route("/associateClientToNote").put(assocController.associateClientToNote);    //has working bu

    // res.render('associations', {message: "Association set"});
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};


//Many(Notes)-To-Many(Docs)// working

exports.associateDocsToNote = async (req, res) => {
  try {
    const {assoc1type, assoc1Id, assoc2type, assoc2Id } = req.body; 
    let noteId = assoc1Id;
    // let docId = assoc1Id;
    let docIdArray = assoc2Id;
    const existingNote = await Note.findByPk(noteId);
    await existingNote.addDocs(docIdArray);
    const resources = await Note.findByPk(noteId, { include: [Doc] });
    res.render("/viewNoteOrDoc", {resources, success: "Association processed" });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

//messed up working copy - see working insomnia version before changes on 3/11
exports.associateNotesToDoc = async (req, res) => {
  try {
    const { assoc1Id, assoc2Id } = req.body;
    let noteId = assoc1Id;
    let docId = assoc2Id;
    const existingDoc = await Doc.findByPk(docId);
    await existingDoc.addNotes(noteId);
    const updatedDoc = await Doc.findByPk(docId, { include: [Note] });
    res.render("/associations", { assoc1type, assoc1Id, assoc2type, assoc2Id, existingDoc, success: "Association processed" });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
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
    const { oClientId, ownerId } = req.body;
    const existingUser = await User.findByPk(ownerId);    //find the one user
    await existingUser.addClients(oClientId);             //associate the clients
    const updatedUser = await User.findByPk(ownerId, { include: [Client] });    //find the one user again including Client
    res.send(updatedUser);
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};


exports.associateUsersToClient = async (req, res) => {    //works
  try {
    const { oClientId, ownerId } = req.body;    //correct
    // console.log("oClientId: " + oClientId + ", ownerId: " + ownerId);
    const existingClient = await Client.findByPk(oClientId);
    await existingClient.addUsers(ownerId);

    // const updatedClient = await Client.findByPk(oClientId, { include: [User] });
    res.send("success");
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

// working version
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
