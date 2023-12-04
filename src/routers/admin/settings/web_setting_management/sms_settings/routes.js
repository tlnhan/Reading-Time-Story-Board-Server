const express = require("express");
const smsSettingsController = require("../../../../../controllers/admin/settings/web_setting_management/sms_settings/controller");

const router = express.Router();

router.post("/", smsSettingsController.SMSSettings);

module.exports = router;