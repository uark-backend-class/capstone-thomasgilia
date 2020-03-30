const Note = require("../db").Note;
const Doc = require("../db").Doc;
const Client = require("../db").Client;

exports.newClientPage = (req, res) => {
  res.render('createClient', { existingClient: false });
};

exports.newClient = async (req, res) => {
  try {
    //always create 'all clients' as client with id 1 if not already created
    let allClientsClient1 = {
      clientName: "All Clients", ownedByUser: false, ownedBy: "N/A", keyClient: false,
      reqQuote: false, reqQuoteApproval: false, standardDiscount: 0, revisionLog: ""
    };
    let thisClient;
    let allClients = await Client.findAll();
    // console.log(allClients.length);
    if (allClients.length <= 1) {
      await Client.create(allClientsClient1);
      thisClient = await Client.create(req.body);
    } else {
      thisClient = await Client.create(req.body);
    }
    res.render('viewClient', { thisClient });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.viewClient = async (req, res) => {
  try {
    let clientId = req.params.id;
    let thisClient = await Client.findByPk(clientId);
    res.render('viewClient', { thisClient });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

exports.listClients = async (req, res) => {
  try {
    let allClients = await Client.findAll();
    console.log(allClients);
    res.render('listClients', { allClients });
  } catch (error) {
    console.log("HERE'S THE ERROR" + error);
  }
};

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
