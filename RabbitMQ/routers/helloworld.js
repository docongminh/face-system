const router = require('express').Router();

router.get('/', (req, res) =>{
    res.status(200).json({
        "hello": "Hello world"
    });
});

module.exports = router;