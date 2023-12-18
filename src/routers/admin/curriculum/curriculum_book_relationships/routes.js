const express = require("express");
const curriculumBookRelationshipsController = require("../../../../controllers/admin/curriculum/curriculum_book_relationships/controller");

const router = express.Router();

router.post("/", curriculumBookRelationshipsController.CurriculumBookRelationships);

module.exports = router;
