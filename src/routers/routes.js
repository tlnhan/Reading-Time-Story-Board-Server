const express = require("express");

const router = express.Router();

// SETTINGS

// Settings - Web setting Management
const webSettingsRouter = require("./admin/settings/web_setting_management/web_settings/routes");
router.use("/settings/webSettingManagement", webSettingsRouter);
// Settings - Mail setting Management
const mailSettingsRouter = require("./admin/settings/web_setting_management/mail_settings/routes");
router.use("/settings/mailSettingManagement", mailSettingsRouter);
// Setting - Admin setting Managament
const adminSettingsRouter = require("./admin/settings/web_setting_management/admin_settings/routes");
router.use("/settings/adminSettingManagement", adminSettingsRouter);
// Setting - SMS setting Management
const smsSettingsRouter = require("./admin/settings/web_setting_management/sms_settings/routes");
router.use("/settings/smsSettingManagement", smsSettingsRouter);
// Setting - PG setting Management
const pgSettingsRouter = require("./admin/settings/web_setting_management/pg_settings/routes");
router.use("/settings/pgSettingManagement", pgSettingsRouter);
// Setting - Terms of Use
const termsOfUseRouter = require("./admin/settings/terms_management/terms_of_use/routes");
router.use("/settings/termsOfUse", termsOfUseRouter);
// Setting - Privacy Policy
const privacyPolicyRouter = require("./admin/settings/terms_management/privacy_policy/routes");
router.use("/settings/privacyPolicy", privacyPolicyRouter);
// Setting - Payment and Refund Policy
const paymentAndRefundPolicyRouter = require("./admin/settings/terms_management/payment_and_refund_policy/routes");
router.use("/settings/paymentAndRefundPolicy", paymentAndRefundPolicyRouter);
// Setting - Promotion Terms and Conditions
const promotionTermsAndConditionsRouter = require("./admin/settings/terms_management/promotion_terms_and_conditions/routes");
router.use(
  "/settings/promotionTermsAndConditions",
  promotionTermsAndConditionsRouter
);
// Setting - Holiday Management
const holidayManagementRouter = require("./admin/settings/holiday_management/routes");
router.use("/settings/holidayManagement", holidayManagementRouter);
// Setting - Menu Permission Management
const menuPermissionManagementRouter = require("./admin/settings/menu_permission_management/routes");
router.use(
  "/settings/menuPermissionManagement",
  menuPermissionManagementRouter
);

// ACCOUNT
// Account - Role
const accountRoleRouter = require("./admin/account/role/routes");
router.use("/account/role", accountRoleRouter);
// Account - User
const accountUserRouter = require("./admin/account/user/routes");
router.use("/account/user", accountUserRouter);

module.exports = router;
