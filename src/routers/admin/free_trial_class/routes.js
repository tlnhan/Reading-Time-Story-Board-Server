const express = require("express");
const freeTrialClassController = require("../../../controllers/admin/free_trial_class/controller");

const router = express.Router();

router.get("/", freeTrialClassController.FreeTrialClass);

module.exports = router;