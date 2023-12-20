const express = require("express");
const authorityController = require("../../../controllers/admin/authority/controller");

const router = express.Router();

router.post("/", authorityController.Authority);

module.exports = router;