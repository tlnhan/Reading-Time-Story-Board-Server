const express = require("express");
const workingHoursTableController = require("../../../controllers/admin/working_hours_table/controller");

const router = express.Router();

router.get("/", workingHoursTableController.WorkingHoursTable);

module.exports = router;