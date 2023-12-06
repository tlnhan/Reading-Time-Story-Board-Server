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
// Account - Teacher
const accountTeacherRouter = require("./admin/account/teacher/routes");
router.use("/account/teacher", accountTeacherRouter);

// Working Hours
const workingHoursRouter = require("./admin/working_hours/routes");
router.use("/workingHours", workingHoursRouter);

// Vacation and Resignation Management
const vacationAndResignationManagementRouter = require("./admin/vacation_and_registration_management/routes");
router.use(
  "/vacationAndResignationManagement",
  vacationAndResignationManagementRouter
);

// Point and Penalty Management
const pointAndPenaltyManagementRouter = require("./admin/point_and_penalty_management/routes");
router.use("/pointAndPenaltyManagement", pointAndPenaltyManagementRouter);

// Class Feedback
const classFeedbackRouter = require("./admin/class_feedback/routes");
router.use("/classFeedback", classFeedbackRouter);

// Payment
const paymentRouter = require("./admin/payment/routes");
router.use("/payment", paymentRouter)

// Book Contents
const bookContentsRouter = require("./admin/book/routes");
router.use("/bookContents", bookContentsRouter);

// Curriculum Contents
const curriculumContentsRouter = require("./admin/curriculum/routes");
router.use("/curriculumContents", curriculumContentsRouter);

// Regular Product
const regularProductRouter = require("./admin/regular_product/routes");
router.use("/regularProduct", regularProductRouter);

// Free Trial Product
const freeTrialProductRouter = require("./admin/free_trial_product/routes");
router.use("/freeTrialProduct", freeTrialProductRouter);

// Payment Management
const paymentManagmentRouter = require("./admin/payment_management/routes");
router.use("/paymentManagement", paymentManagmentRouter);

// Assignment Regular
const assignmentRegularRouter = require("./admin/assignment_regular/routes");
router.use("/assignmentRegular", assignmentRegularRouter);

// Regular Class
const regularClassRouter = require("./admin/regular_class/routes");
router.use("/regularClass", regularClassRouter);

// Free Trial Class
const freeTrialClassRouter = require("./admin/free_trial_class/routes");
router.use("/freeTrialClass", freeTrialClassRouter);

// Coupon
const couponRouter = require("./admin/coupon/routes");
router.use("/coupon", couponRouter);

// Banner
const bannerRouter = require("./admin/banner/routes");
router.use("/banner", bannerRouter);

// Board Notice
const boardNoticeRouter = require("./admin/board/notice/routes");
router.use("/board/notice", boardNoticeRouter);

// Board FQA
const boardFAQRouter = require("./admin/board/faq/routes");
router.use("/board/faq", boardFAQRouter);

// Board Support
const boardSupportRouter = require("./admin/board/support/routes");
router.use("/board/support", boardSupportRouter);

module.exports = router;
