const express = require("express");
const adminSettingsController = require("../../../../../controllers/admin/settings/web_setting_management/admin_settings/controller");

const router = express.Router();

router.post("/", adminSettingsController.AdminSettings);

module.exports = router;