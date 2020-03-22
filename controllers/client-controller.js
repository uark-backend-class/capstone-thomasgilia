const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;

exports.newClientPage = (req, res) => {
  let allClients = Client.findAll();
  res.render('clientCreate', { action: 'clients', resourceType: "Client", allClients, existingClient: false });
};

exports.newClient = async (req, res) => {
  try {
    //always create 'all clients' as client with id 1 if not already created
    // let allClientsClient1 = {
    //   id: 1, clientName: "All Clients", ownedByUser: false, hasOwnPriceList: false, linkOwnPriceList: "Not Applicable",
    //   hasOwnManual: false, linkOwnManual: "Not applicable", revisionLog: ""
    // };
    let clientList = Client.findAll();
    let newClient;
    // if (clientList.length > 1) {
      newClient = await Client.create(req.body); //later is replaced with html form i think
    // } else {
    //   await Client.create(allClientsClient1);
    // }
    // console.log(newClient);
    res.redirect('/');
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
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

//...........................................
// //works for note only - replaced by below
// exports.allNotesThisClient = async (req, res) => {
//   try {
//     const clientId = 2;
//     // const clientId = req.params.clientId;
//     // console.log(clientId);
//     let thisClient = await Client.findByPk(clientId);
//     let resources = await thisClient.getNotes(clientId);
//     let hasClient = true;
//     // res.json(noteList);
//     res.render("listNotesOrDocs", { resourceType: "Note", hasClient, thisClient, resources });
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

//...........................................
// //also works for note only - replaced by below
// exports.listResourceThisClient = async (req, res) => {
//   try {
//     const clientId = 2; //temporary
//     let resourceType = "Note"; //temporary
//     let hasClient = true;
//       const resources = await Note.findAll({ where: { clientId: clientId } }); //gives whole note
//       // let resources = await thisClient.getNotes();  //works at least to give whole note in conjuct w/ previous findbypk
//       //console.log(resources[0].id);//have to iterate to get all. handlebars #each is iterating!
//     let thisClient = await Client.findByPk(clientId);
//     let typeNote;
//     res.render("listNotesOrDocs", {
//       resourceType,
//       hasClient,
//       thisClient,
//       resources,
//       typeNote,
//     });
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };


//works and works with listDocorNote.hbs
exports.listResourceThisClient = async (req, res) => {
  try {
    const clientId = 2; //temporary
    let resourceType = "Doc"; //temporary
    let hasClient = true;
    let notes = await Note.findAll({ where: { clientId: clientId } });
    let thisClient = await Client.findByPk(clientId);
    let resources = [];
    if (resourceType == "Note") {
      resources.push = notes;
      return resources;
      // let typeNote;   //why had this? need to put render within if/else separately and have this typenote thing?
    } else if (resourceType = "Doc") {
      //iterate through each note in notes above to get docs associated with each note
      for (let note of notes) {
        thisNoteId = note.id;       //this note's id
        thisNote = await Note.findByPk(thisNoteId, { include: [Doc] });      //finds individual note but including docs
        resources = await thisNote.getDocs();       //gets docs associated to that individual note
      }
    }
    res.render("listNotesOrDocs", {
      resourceType,
      hasClient,
      thisClient,
      resources,
      // typeNote,
    });
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

//doesn't work despite being identical to note and doc deletes
exports.deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const obsoleteClient = await Client.findByPk(id);
    if (!obsoleteClient) {
      res.status(404).send();
      return;
    }
    await obsoleteClient.destroy();
    res.json(obsoleteClient);
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};
