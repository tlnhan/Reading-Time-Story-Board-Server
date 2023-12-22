const express = require("express");
const regularClassController = require("../../../../controllers/admin/class_management/regular_class/controller");

const router = express.Router();

router.post("/", regularClassController.RegularClass);

module.exports = router;