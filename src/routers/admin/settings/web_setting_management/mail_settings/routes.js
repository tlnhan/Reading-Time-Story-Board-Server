const express = require("express");
const mailSettingsController = require("../../../../../controllers/admin/settings/web_setting_management/mail_settings/controller");

const router = express.Router();

router.post("/", mailSettingsController.MailSettings);

module.exports = router;