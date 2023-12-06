const express = require("express");
const regularClassController = require("../../../controllers/admin/regular_class/controller");

const router = express.Router();

router.get("/", regularClassController.RegularClass);

module.exports = router;