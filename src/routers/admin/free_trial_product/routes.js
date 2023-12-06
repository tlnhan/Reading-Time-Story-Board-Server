const express = require("express");
const freeTrialProductController = require("../../../controllers/admin/free_trial_product/controller");

const router = express.Router();

router.post("/", freeTrialProductController.FreeTrialProduct);

module.exports = router;