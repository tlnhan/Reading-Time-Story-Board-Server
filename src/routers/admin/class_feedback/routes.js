const express = require("express");
const classFeedbackController = require("../../../controllers/admin/class_feedback/controller");

const router = express.Router();

router.get("/", classFeedbackController.ClassFeedback);

module.exports = router;