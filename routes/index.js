const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const assocController = require("../controllers/assoc-controller");
// const authController = require('../controllers/auth-controller');

router
  .route("/notes")
  .get(noteController.getAllNotes)
  .post(noteController.newNote);
router
  .route("/notes/:id")
  .delete(noteController.deleteNote)
  // .put(noteController.updateNote)
  .get(noteController.associateDocIdForThisNote);
// .put(noteController.setDocId);

router
  .route("/docs")
  .get(docController.getAllDocs)
  .post(docController.newDoc);
router
  .route("/docs/:id")
  .delete(docController.deleteDoc)
  .put(docController.replaceDoc);

router
  .route("/clients")
  .get(clientController.getAllClients)
  .post(clientController.newClient);

// router
//   .route("/associateThisNoteToClient/:id")
//   // .delete(docController.deleteClient)
//   .(noteController.associateNoteToClient);


//once get away from routes, can simplify these two association routes
router.route("/associationsDocsToNote").put(assocController.associateDocsToNote);
router.route("/associationsNotesToDoc").put(assocController.associateNotesToDoc);
router.route("/associationsClientsToUser").put(assocController.associateClientsToUser);
router.route("/associationsUsersToClient").put(assocController.associateUsersToClient);
router.route("/associationsClientToNote").put(assocController.associateClientToNote);

module.exports = router;