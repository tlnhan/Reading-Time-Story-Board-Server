const express = require("express");
const webSettingsController = require("../../../../../controllers/admin/settings/web_setting_management/web_settings/controller");

const router = express.Router();

router.post("/", webSettingsController.WebSettings);

module.exports = router;