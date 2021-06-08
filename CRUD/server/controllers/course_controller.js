const mongoose = require('mongoose');
const Course = require('../models/course');

// create new course
async function createCourse(req, res){
    const course = new Course({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
    });
    return course.save().then((newCourse) => {
        return res.status(201).json({
            success: true,
            message: 'New course was created !',
            Course: newCourse,
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please re-try',
            error: error.message,
        });
    });
}
// get all course
async function getAllCourse(req, res){
    Course.find()
        .select('_id title description')
        .then((allCourse) => {
            return res.status(200).json({
                success: true,
                message: "List course",
                Course: allCourse,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Server error, Please re-try",
                error: error.message
            });
        });
}
// get single course
async function getSingleCourse(req, res){
    const id = req.params.courseId;
    Course.findById(id)
        .then((singleCourse) => {
            res.status(200).json({
                success: true,
                message: `More on ${singleCourse.title}`,
                Course: singleCourse
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'This course does not exists',
                error: error.message
            });
    });
}
// update
async function updateCourse(req, res){
    const id = req.params.courseId;
    const updateObject = req.body;
    Course.update(
        {_id: id},
        {$set:updateObject}
    )
    .exec()
    .then(() => {
        res.status(204).json({
            success: true,
            message: 'Course updated',
            updateCourse: updateObject
        });
    })
    .catch((error) => {
        res.status(500).json({
            success: false,
            message: "Server error, re-try again",
            error: error.message
        });
    });
}
// delete course
async function deleteCourse(req, res){
    const id = req.params.courseId;
    Course.findByIdAndRemove(id)
        .exec()
        .then(() => {
            res.status(204).json({
                success: true,
                message: "Deleted course"
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error delete course",
                error: error.message
            });
        });
}
// export
module.exports = {createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse};