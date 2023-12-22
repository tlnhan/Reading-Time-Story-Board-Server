const express = require("express");
const pointAndPenaltyManagementController = require("../../../../controllers/admin/teacher_management/point_and_penalty_management/controller");

const router = express.Router();

router.post("/", pointAndPenaltyManagementController.PointAndPenaltyManagement);

module.exports = router;