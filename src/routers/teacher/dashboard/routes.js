const express = require("express");
const dashboardTeacherController = require("../../../controllers/teacher/dashboard/controller");

const router = express.Router();

router.post("/", dashboardTeacherController.DashboardTeacher);

module.exports = router;