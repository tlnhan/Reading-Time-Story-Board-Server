const express = require("express");
const curriculumController = require("../../../controllers/admin/curriculum/controller");

const router = express.Router();

router.post("/", curriculumController.CurriculumContents);

module.exports = router;