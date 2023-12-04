const express = require("express");
const pgSettingsController = require("../../../../../controllers/admin/settings/web_setting_management/pg_settings/controller");

const router = express.Router();

router.post("/", pgSettingsController.PGSettings);

module.exports = router;