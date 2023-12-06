const express = require("express");
const paymentManagementController = require("../../../controllers/admin/payment_management/controller");

const router = express.Router();

router.post("/", paymentManagementController.PaymentManagement);

module.exports = router;