const express = require("express");

const router = express.Router();

//Settings

// Settings - Web setting Management
const webSettingsRouter = require("./admin/settings/web_setting_management/web_settings/routes");
router.use("/settings/webSettingManagement", webSettingsRouter);
// Settings - Mail setting Management
const mailSettingsRouter = require("./admin/settings/web_setting_management/mail_settings/routes");
router.use("/settings/mailSettingManagement", mailSettingsRouter);
// Setting - Admin setting Managament
const adminSettingsRouter = require("./admin/settings/web_setting_management/admin_settings/routes");
router.use("/settings/adminSettingManagement", adminSettingsRouter);
// Setting - SMS setting Management
const smsSettingsRouter = require("./admin/settings/web_setting_management/sms_settings/routes");
router.use("/settings/smsSettingManagement", smsSettingsRouter);
// Setting - PG setting Management
const pgSettingsRouter = require("./admin/settings/web_setting_management/pg_settings/routes");
router.use("/settings/pgSettingManagement", pgSettingsRouter);

module.exports = router;
