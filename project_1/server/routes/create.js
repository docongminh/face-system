const express = require('express');
const createCourse = require('../controllers/course');

const router = express.Router();
// router.post('/course', createCourse);
router.post('/create', function(req, res){
    // console.log("test course api");
    createCourse
});

module.exports = router;