const Client = require("../db").Client;

exports.newClientPage = (req, res) => {
  res.render('createClient', { existingClient: false });
};

exports.newClient = async (req, res) => {
  try {
    //always create 'all clients' as client with id 1 if not already created
    let allClientsClient1 = {
      clientName: "General/All Clients", ownedByUser: false, ownedBy: "N/A", keyClient: false,
      reqQuote: false, reqQuoteApproval: false, standardDiscount: 0, revisionLog: ""
    };
    let thisClient;
    let allClients = await Client.findAll();
    if (allClients.length <= 1) {
      await Client.create(allClientsClient1);
      thisClient = await Client.create(req.body);
    } else {
      thisClient = await Client.create(req.body);
    }
    res.render('viewClient', { thisClient });
  } catch (error) {
    console.log("HERE'S THE ERROR IN NEWCLIENT: " + error);
  }
};

exports.viewClient = async (req, res) => {
  try {
    let clientId = req.params.id;
    let thisClient = await Client.findByPk(clientId);
    res.render('viewClient', { thisClient });
  } catch (error) {
    console.log("HERE'S THE ERROR IN VIEWCLIENT: " + error);
  }
};

exports.listClients = async (req, res) => {
  try {
    let allClients = await Client.findAll();
    console.log(allClients);
    res.render('listClients', { allClients });
  } catch (error) {
    console.log("HERE'S THE ERROR IN LISTCLIENTS: " + error);
  }
};