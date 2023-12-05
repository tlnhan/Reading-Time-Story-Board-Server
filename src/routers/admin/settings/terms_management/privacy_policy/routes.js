const express = require("express");
const privacyPolicyController = require("../../../../../controllers/admin/settings/terms_management/privacy_policy/controller");

const router = express.Router();

router.post("/", privacyPolicyController.PrivacyPolicy);

module.exports = router;