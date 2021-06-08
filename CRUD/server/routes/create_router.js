const express = require('express');
const {createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse} = require('../controllers/course_controller');

const router = express.Router();
router.post('/create', function(req, res){
    createCourse(req, res)
});
router.get('/courses', function(req, res){
    getAllCourse(req, res)
});
// get single course
router.get('/singlecourse/:courseId', function(req, res){
    getSingleCourse(req, res)
});
// update course
router.patch('/update/:courseId', function(req, res){
    updateCourse(req, res)
});
// delete course
router.delete('/delete/:courseId', function(req, res){
    console.log("Check delete course")
    deleteCourse(req, res)
});
module.exports = router;