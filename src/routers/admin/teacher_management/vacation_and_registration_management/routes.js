const express = require("express");
const vacationAndResignationController = require("../../../../controllers/admin/teacher_management/vacation_and_resignation_management/controller");

const router = express.Router();

router.post("/", vacationAndResignationController.VacationAndResignationManagement);

module.exports = router;