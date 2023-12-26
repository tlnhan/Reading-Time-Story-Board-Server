const express = require("express");
const assginmentASTeacherController = require("../../../controllers/teacher/assignment_status/controller");

const router = express.Router();

router.post("/", assginmentASTeacherController.AssignmentStatus);

module.exports = router;