const User = require("../db").User;
// const Doc = require("../db").Doc; 
const Client = require("../db").Client;
const Workspace = require("../db").Workspace;

// //this works in insomnia - deprecated
// exports.newUser = async (req, res) => {
//     try {
//         let newUser = await User.create(req.body); //later is replaced with html form i think
//         res.json(newUser);
//     } catch (error) {
//         console.log("HERE/'S THE ERROR" + error);
//     }
// };


//working 
exports.newUser = async (req, res) => {
    try {
        let newUser = await User.create(req.body); //later is replaced with html form i think
        let userId = newUser.id;
        // console.log(userId);
        //..........................................................
        //dont think i need this funcationality here - when caraet new user, dont  have to associate yet
        // let theNewUser = await User.findByPk(userId);             //find the one user we just created
        // let ownedClients = await theNewUser.getClients({ include: [Client] });  //.clientName;
        // console.log(ownedClients);
        // //example
        // const { oClientId, ownerId } = req.body;
        // const existingUser = await User.findByPk(ownerId);    //find the one user
        // await existingUser.addClients(oClientId);             //associate the clients
        // const updatedUser = await User.findByPk(ownerId, { include: [Client] });    //find the one user again including Client
        //............................................................
        let favorites = "placeholder favorites";
        let newWorkspace = await Workspace.create({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            ownedClients: "",
            accessLevel: newUser.accessLevel,
            favorites: favorites,
        });
        await newWorkspace.setUser(userId);
        res.json(newUser);
    } catch (error) {
        console.log("HERE/'S THE ERROR" + error);
    }
};

exports.deleteUser = async (req, res) => {      //destroys user and attached workspace
    try {
        const id = req.params.id;
        const obsoleteUser = await User.findByPk(id);
        const obsoleteWorkspace = await obsoleteUser.getWorkspace();
        if (!obsoleteUser) {
            res.status(404).send();
            return;
        }
        await obsoleteUser.destroy();
        await obsoleteWorkspace.destroy();        
        res.json("User " + obsoleteUser.id + " and Workspace " + obsoleteWorkspace.id + " were deleted");  //working
    } catch (error) {
        console.log("HERE'S THE ERROR" + error);
    }
};


//User-CLient join table IDs:  oClientId  ownerId
exports.homepage = async (req, res) => {
    try {
        const { oClientId, ownerId } = req.body;
        // let users = await User.findAll({where: {oClientId: oClientId}});
        // let clientsOwnedId = user.clientsOwned; //deprecated probably
        let clientsOwned = await Client.findAll(ownerId);
        // let clientsOwned = await Client.findAll({where: {userId: clientsOwned}}) //dont think this worked
        // let newNote = await existingClient.getNotes(clientId); //example only
        res.render("homepage", { user, clientsOwned });
    } catch (error) {
        console.log("HERE'S THE ERROR" + error);
    }
}       //see association controller...