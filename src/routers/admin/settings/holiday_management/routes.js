const express = require("express");
const holidayManagementController = require("../../../../controllers/admin/settings/holiday_management/controller");

const router = express.Router();

router.post("/", holidayManagementController.HolidayManagement);

module.exports = router;