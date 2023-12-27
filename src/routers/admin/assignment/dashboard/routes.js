const express = require("express");
const assginmentDashboardController = require("../../../../controllers/admin/assignment/dashboard/controller");

const router = express.Router();

router.post("/", assginmentDashboardController.Dashboard);

module.exports = router;