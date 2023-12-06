const express = require("express");
const workingHoursController = require("../../../controllers/admin/working_hours/controller");

const router = express.Router();

router.post("/", workingHoursController.WorkingHours);

module.exports = router;