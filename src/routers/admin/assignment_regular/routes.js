const express = require("express");
const assginmentRegularController = require("../../../controllers/admin/assignment_regular/controller");

const router = express.Router();

router.post("/", assginmentRegularController.AssignmentRegular);

module.exports = router;