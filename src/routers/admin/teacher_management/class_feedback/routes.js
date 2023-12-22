const express = require("express");
const classFeedbackController = require("../../../../controllers/admin/teacher_management/class_feedback/controller");

const router = express.Router();

router.post("/", classFeedbackController.ClassFeedback);

module.exports = router;