const Note = require("../db").Note;
// const Doc = require("../db").Doc;
const Client = require("../db").Client;

exports.newClient = async (req, res) => {
  try {
    let newClient = await Client.create(req.body); //later is replaced with html form i think
    res.json(newClient);
    console.log(newClient);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

exports.getAllClients = async (req, res) => {
  try {
    let allClients = await Client.findAll();
    res.json(allClients);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

// exports.allNotesThisClient = async (req, res) => {
//   try {
//     const clientId = 2;
//     // const clientId = req.params.clientId;
//     // console.log(clientId);
//     let thisClient = await Client.findByPk(clientId);
//     let resources = await thisClient.getNotes(clientId);
//     let hasClient = true;
//     // res.json(noteList);
//     res.render("listNoteOrDoc", { resourceType: "Note", hasClient, thisClient, resources });
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

//prob do need to break apart
exports.listResourceThisClient = async (req, res) => {
  try {
    const clientId = 2; //temporary
    let resourceType = "Document"; //temporary
    let thisClient = await Client.findByPk(clientId);

    let hasClient = true;
    if (resourceType == "Note") {
      let resources = await Note.findAll({where: {clientId: clientId}});
      // let resources = await thisClient.getNotes(clientId);
      res.render("listNoteOrDoc", {
        resourceType,
        hasClient,
        thisClient,
        resources,
      });
    } else if (resourceType == "Document") {
      // let resources = await Doc.findAll();
      let resources = await thisClient.getDocs(clientId);
      res.render("listNoteOrDoc", {
        resourceType,
        hasClient,
        thisClient,
        resources,
      });
    }
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

// exports.deleteClient = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const obsoleteClient = await Client.findByPk(id);
//     if (!obsoleteClient) {
//       res.status(404).send();
//       return;
//     }
//     await obsoleteClient.destroy();
//     res.json(obsoleteClient);
//   } catch (error) {
//     console.log("HERE/'S THE ERROR" + error);
//   }
// };

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
//   } catch (error) {
//     console.log(error);
//   }
// };
