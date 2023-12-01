const express = require("express");

const router = express.Router();

//Settings

// Settings - Web setting Management
const webSettingsRouter = require("./admin/settings/web_setting_management/web_settings/routes");
router.use("/settings/webSettingManagement", webSettingsRouter);
// Settings - Mail setting Management
const mailSettingsRouter = require("./admin/settings/web_setting_management/mail_settings/routes");
router.use("/settings/mailSettingManagement", mailSettingsRouter);

module.exports = router;