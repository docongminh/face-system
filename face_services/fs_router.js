const router = require('express').Router();
const fsController = require('./fs_controller');

// create embedding
router.post('/', function(req, res) {
    return fsController.create(req, res);
});

// get all embedding
router.get('/', (req, res) => {
    return fsController.getAll(req, res);
});

module.exports = router;