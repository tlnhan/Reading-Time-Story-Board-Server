const express = require("express");
const teamController = require("../../../controllers/admin/team/controller");

const router = express.Router();

router.get("/", teamController.Team);

module.exports = router;