const router = require('express').Router();
const embedding = require('../controllers/embeddingController');

// create embedding
router.post('/', function(req, res) {
    return embedding.create(req, res);
});
// get all embedding
router.get('/', (req, res) => {
    return embedding.getAll(req, res);
});

module.exports = router;