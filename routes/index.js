const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const assocController = require("../controllers/assoc-controller");
const NoteDocController = require("../controllers/NoteDoc-controller");
const NoteClientController = require("../controllers/NoteClient-controller");
const UserClientController = require("../controllers/UserClient-controller");
const userController = require("../controllers/user-controller");
// const authController = require('../controllers/auth-controller');

// router
// .route("/notes")                       //worked but deprecated - replace with listResources
// .get(noteController.getAllNotes)      //working in insomnia. ready to connect to view
router
  .route("/notes")
  .get(noteController.newResource)      //working in browser
  .post(noteController.newNote);        //creates a new note but info in form does not translate to note (nulls)

router
  .route("/notes/:id")
  .delete(noteController.deleteNote)    //working in insomnia. ready to connect to view. think already have delete button in listnotesordocs.hbs
  .put(noteController.updateNote)       //working in insomnia. working to improve

router
  .route("/docs")
  .get(docController.getAllDocs)        //working in insomnia. //obsolete/replace with listResources?
  .post(docController.newDoc);          //working in insomnia. 
router
  .route("/docs/:id")
  .delete(docController.deleteDoc)      //think should work - just like note delete
  .put(docController.replaceDoc);       //needs work

router
  .route("/clients")
  .get(clientController.getAllClients)  //working in insomnia. ready to connect to view.
  .post(clientController.newClient)    //working in insomnia. ready to connect to view (post method)
router
  .route("/clients/:id").delete(clientController.deleteClient);      //working insom. put admin and safety step on here later

router
  .route("/users")
  .post(userController.newUser);    //working in insomnia. ready to connect to view (post method)
router
  .route("/users/:id")
  .delete(userController.deleteUser);   //working insom. put admin and safety step on here later. also deletes workspace

// router.route("/associations").get(assocController.associationsPage);  
router.route("/associations").post(assocController.associations); 
// router.route("/associateDocsToNote").put(assocController.associateDocsToNote);  //works in insomnia
// router.route("/associateNotesToDoc").put(assocController.associateNotesToDoc);  //works in insomnia
// router.route("/associateClientsToUser").put(assocController.associateClientsToUser);  //working insomnia
// router.route("/associateUsersToClient").put(assocController.associateUsersToClient);  //working insomnia
router.route("/associateClientToNote").put(assocController.associateClientToNote);    //has working but has pending changes version too

//querying using join controllers
// router.route("/listClientNotes/:id").get(clientController.allNotesThisClient);
//may revert to prev line
router.route("/listClientResources/:id").get(clientController.listResourceThisClient);  //works (with temp inputs) with view
// router.route("/listClientDocs/:id").get(clientController.listResourceThisClient);  //route  deprecated but may need to change route

// router.route("/creationControl").get(NoteDocController.creationControl);
router.route("/listAllResources").get(NoteDocController.listAllResources);    //working n browser/listnotesordocs view 
//but still manual entry some values
// router.route("/createResource").post(NoteDocController.createResource);

router.route("/homepageUser:id").get(userController.homepage);

router.route("/").get(userController.root);     //placeholder for redirects

module.exports = router;