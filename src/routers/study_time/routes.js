const express = require("express");
const studyTimeController = require("../../controllers/study_time/controller");

const router = express.Router();

router.get("/", studyTimeController.StudyTime);

module.exports = router;