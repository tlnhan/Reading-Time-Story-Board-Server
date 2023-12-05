const express = require("express");
const paymentAndRefundPolicyController = require("../../../../../controllers/admin/settings/terms_management/payment_and_refund_policy/controller");

const router = express.Router();

router.post("/", paymentAndRefundPolicyController.PaymentAndRefundPolicy);

module.exports = router;