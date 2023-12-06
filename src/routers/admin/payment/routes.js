const express = require("express");
const paymentController = require("../../../controllers/admin/payment/controller");

const router = express.Router();

router.get("/", paymentController.Payment);

module.exports = router;