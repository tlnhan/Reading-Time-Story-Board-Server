const express = require("express");
const termsOfUseController = require("../../../../../controllers/admin/settings/terms_management/terms_of_use/controller");

const router = express.Router();

router.post("/", termsOfUseController.TermsOfUse);

module.exports = router;