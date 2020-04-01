const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const NoteDocController = require("../controllers/NoteDoc-controller");
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
  .get(noteController.deleteNote)

router.route("/edit/Note:id")
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
  .post(docController.newDoc)         
  .get(docController.rerouteNewDoc);

router.route("/documents").get(docController.rerouteNewDoc);  

router
  .route("/docs/note:id")             
  .get(docController.newResource)    

router               
  .route("/docs/doc:id")
  .get(docController.viewDoc);

router
  .route("/clients")
  .get(clientController.newClientPage)
  .post(clientController.newClient)    
router
  .route("/listClients")
  .get(clientController.listClients)    

router            
  .route("/clients/client:id")
  .get(clientController.viewClient);

router.route("/listAllResources").post(NoteDocController.listAllResources);

router.route("/homepage").get(userController.homepage); 

module.exports = router;