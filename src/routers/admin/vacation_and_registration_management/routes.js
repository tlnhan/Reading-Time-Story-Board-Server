const express = require("express");
const vacationAndResignationController = require("../../../controllers/admin/vacation_and_resignation_management/controller");

const router = express.Router();

router.post("/", vacationAndResignationController.VacationAndResignationManagement);

module.exports = router;