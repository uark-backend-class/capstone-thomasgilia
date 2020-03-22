const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;
const User = require("../db").User;

//Many(Notes)-To-Many(Docs)// working
//routed for insomnia only right now
exports.associateDocsToNote = async (req, res) => {
  try {
    // const { assoc1Type, assoc1Id, assoc2Type, assoc2Id } = req.body;
    // let noteId = assoc1Id;
    // let docId = assoc1Id;
    let noteId = req.body.noteId;
    let docIdArray = req.body.docId;
    // let docIdArray = assoc2Id;
    const existingNote = await Note.findByPk(noteId);
    await existingNote.addDocs(docIdArray);
    const resources = await Note.findByPk(noteId, { include: [Doc] });
    // res.render("/viewNoteOrDoc", { resources, success: "Association processed" });
    res.send(resources);
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
    res.render("/associations", { assoc1Type, assoc1Id, assoc2Type, assoc2Id, existingDoc, success: "Association processed" });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};


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

