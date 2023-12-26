const express = require("express");
const regularClassTeacherController = require("../../../../controllers/teacher/class_management/regular/controller");

const router = express.Router();

router.post("/", regularClassTeacherController.RegularClassTeacher);

module.exports = router;