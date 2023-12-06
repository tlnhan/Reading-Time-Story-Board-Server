const express = require("express");
const couponController = require("../../../controllers/admin/coupon/controller");

const router = express.Router();

router.post("/", couponController.Coupon);

module.exports = router;