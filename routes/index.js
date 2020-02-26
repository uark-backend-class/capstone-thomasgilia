const router = require('express').Router();
const notesController = require('../controllers/notes-controller');
const docController = require('../controllers/doc-controller');
// const authController = require('../controllers/auth-controller');

router.route('/notes')
    .get(notesController.getAllNotes)
    .post(notesController.newNote);
router.route('/notes/:id')
    .delete(notesController.deleteNote)
    .put(notesController.updateNote)
    .put(notesController.setDocId);

router.route('/docs')
    .get(docController.getAllDocs)
    .post(docController.newDoc);
router.route('/docs/:id')
    .delete(docController.deleteDoc)
    .put(docController.replaceDoc);


module.exports = router;
