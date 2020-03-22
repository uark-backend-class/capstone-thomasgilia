const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const assocController = require("../controllers/assoc-controller");
const NoteDocController = require("../controllers/NoteDoc-controller");
// const NoteClientController = require("../controllers/NoteClient-controller");
// const UserClientController = require("../controllers/UserClient-controller");
const userController = require("../controllers/user-controller");

router
  .route("/notes")
  .get(noteController.newResource)
  .post(noteController.newNote);

router
  .route("/notes/note:id")
  .get(noteController.viewNote);

router
  .route("/delete/note:id")
  .get(noteController.deleteNote)    //working in insomnia. ready to connect to view. think already have delete button in listnotesordocs.hbs
router
  .route("/edit/Note:id")
  .get(noteController.editNote)
  .post(noteController.updateNote);

router
  .route("/edit/Doc:id")
  .get(docController.editDoc)
  .post(docController.updateDoc);

router.route("/notes/note:noteId/client:clientId")
  .post(noteController.addDocToNote);
router.route("/docs/note:noteId/client:clientId")
  .post(docController.deleteDoc);

router
  .route("/docs")
  .post(docController.newDoc)         //working in insomnia. 

router
  .route("/docs/note:id")             //can change back to get?
  .get(docController.newResource)    //have to do post instead of get because need noteId available in create view

router               //not active yet
  .route("/docs/doc:id")
  .get(docController.viewDoc);

// router
//   .route("/delete/docs")
//   .get(docController.deleteDocPage)
// router.route("/delete/doc:id")
//   .post(docController.deleteDoc)
// .put(docController.replaceDoc);       //needs work

router
  .route("/clients")
  .post(clientController.newClient)    //working in insomnia. ready to connect to view (post method)
  .get(clientController.getAllClients)  //working in insomnia. ready to connect to view.
//(not tested after switched order of newClient and getAllClients)
router
  .route("/clients/:id").delete(clientController.deleteClient);      //working insom. put admin and safety step on here later
//add a get clients route?

router
  .route("/users")
  .post(userController.newUser);    //working in insomnia. ready to connect to view (post method)
router
  .route("/users/:id")
  .delete(userController.deleteUser);   //working insom. put admin and safety step on here later. also deletes workspace

router.route("/associateDocsToNote").put(assocController.associateDocsToNote);  //works in insomnia.  deprecated?
// router.route("/associateClientsToUser").put(assocController.associateClientsToUser);  //working insomnia
// router.route("/associateUsersToClient").put(assocController.associateUsersToClient);  //working insomnia

//querying using join controllers
// router.route("/listClientNotes/:id").get(clientController.allNotesThisClient);
//may revert to prev line
// router.route("/listClientResources/:id").get(clientController.listResourceThisClient);  //works (with temp inputs) with view
// router.route("/listClientDocs/:id").get(clientController.listResourceThisClient);  //route  deprecated but may need to change route

router.route("/listAllResources").post(NoteDocController.listAllResources);

router.route("/homepage").get(userController.homepage); //later specialize with User:id

router.route("/").get(userController.root);     //placeholder for redirects

module.exports = router;