const router = require('express').Router();
const notesController = require('../controllers/notes-controller');
// const docController = require('../controllers/doc-controller');
// const authController = require('../controllers/auth-controller');

router.route('/notes')
    .get(notesController.getAll)
    .post(notesController.newNote);

module.exports = router;
