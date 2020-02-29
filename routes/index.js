const router = require("express").Router();
const notesController = require("../controllers/notes-controller");
const docController = require("../controllers/doc-controller");
const clientController = require("../controllers/client-controller");
const assocController = require("../controllers/assoc-controller");
// const authController = require('../controllers/auth-controller');

router
  .route("/notes")
  .get(notesController.getAllNotes)
  .post(notesController.newNote);
router
  .route("/notes/:id")
  .delete(notesController.deleteNote)
  // .put(notesController.updateNote)
  .get(notesController.associateDocIdForThisNote);
// .put(notesController.setDocId);

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

router
  .route("/associateThisNoteToClient/:id")
  // .delete(docController.deleteClient)
  .get(notesController.associateNoteToClient);


//once get away from routes, can simplify these two association routes
router.route("/associationsDocsToNote").put(assocController.associateDocsToNote);
router.route("/associationsNotesToDoc").put(assocController.associateNotesToDoc);


module.exports = router;

//const {movieId, actorId} = req.body
// const movie await movieIdawait movie.addActor(
//see pusehed notes
//also see .getone
//not much diff between set and add except with add can create at same time

//addmultiple add plus plural means can add an array of targets
//even if just one, autos as array when query(?) because later there could be more so dont want to
//switch between data types
