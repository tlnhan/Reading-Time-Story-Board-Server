const express = require("express");
const paymentController = require("../../../../controllers/admin/teacher_management/payment/controller");

const router = express.Router();

router.post("/", paymentController.Payment);

module.exports = router;