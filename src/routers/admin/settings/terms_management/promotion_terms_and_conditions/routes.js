const express = require("express");
const promotionTermsAndConditionsController = require("../../../../../controllers/admin/settings/terms_management/promotion_terms_and_conditions/controller");

const router = express.Router();

router.post("/", promotionTermsAndConditionsController.PromotionTermsAndConditions);

module.exports = router;