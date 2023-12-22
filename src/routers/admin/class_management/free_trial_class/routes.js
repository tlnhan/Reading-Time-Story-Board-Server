const express = require("express");
const freeTrialClassController = require("../../../../controllers/admin/class_management/free_trial_class/controller");

const router = express.Router();

router.post("/", freeTrialClassController.FreeTrialClass);

module.exports = router;