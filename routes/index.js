const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const assocController = require("../controllers/assoc-controller");
const NoteDocController = require("../controllers/NoteDoc-controller");
const NoteClientController = require("../controllers/NoteClient-controller");
const UserClientController = require("../controllers/UserClient-controller");

// const authController = require('../controllers/auth-controller');

router
  .route("/notes")
  // .get(noteController.getAllNotes)      //working in insomnia. ready to connect to view
  .post(noteController.newNote);        //working in insomnia. ready to connect to view (post method)
router
  .route("/notes/:id")
  .delete(noteController.deleteNote)    //working in insomnia. ready to connect to view. think already have delete button in listnoteordoc.hbs
  .put(noteController.updateNote)       //working in insomnia. working to improve

router
  .route("/docs")
  .get(docController.getAllDocs)        //working in insomnia. 
  .post(docController.newDoc);          //working in insomnia. 
router
  .route("/docs/:id")
  .delete(docController.deleteDoc)      //think should work - just like note delete
  .put(docController.replaceDoc);       //needs work

router
  .route("/clients")
  .get(clientController.getAllClients)  //working in insomnia. ready to connect to view.
  .post(clientController.newClient);    //working in insomnia. ready to connect to view (post method)

// router
//   .route("/associateThisNoteToClient/:id")
//   // .delete(docController.deleteClient)
//   .(noteController.associateNoteToClient);


//once get away from routes, can simplify these two association routes
router.route("/associateDocsToNote").put(assocController.associateDocsToNote);  //not giving error but not working
router.route("/associateNotesToDoc").put(assocController.associateNotesToDoc);  //works in insomnia
router.route("/associateClientsToUser").put(assocController.associateClientsToUser);  //has one but no test yet
router.route("/associateUsersToClient").put(assocController.associateUsersToClient);  //has one but no test yet
router.route("/associateClientToNote").put(assocController.associateClientToNote);    //has working but has pending changes version too

//querying using join controllers
// router.route("/listClientNotes/:id").get(clientController.allNotesThisClient);
//may revert to prev line
router.route("/listClientResources/:id").get(clientController.listResourceThisClient);
router.route("/listClientD ocs/:id").get(clientController.listResourceThisClient);

// router.route("/creationControl").get(NoteDocController.creationControl);
// router.route("/listAllResources").get(NoteDocController.listAllResources);
// router.route("/createResource").post(NoteDocController.createResource);

module.exports = router;