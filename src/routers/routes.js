const express = require("express");

const router = express.Router();

// Admin
// Settings
// Web setting Management
const webSettingsRouter = require("./admin/settings/web_setting_management/web_settings/routes");
router.use("/settings/webSettingManagement", webSettingsRouter);
// Mail setting Management
const mailSettingsRouter = require("./admin/settings/web_setting_management/mail_settings/routes");
router.use("/settings/mailSettingManagement", mailSettingsRouter);
// Admin setting Managament
const adminSettingsRouter = require("./admin/settings/web_setting_management/admin_settings/routes");
router.use("/settings/adminSettingManagement", adminSettingsRouter);
// SMS setting Management
const smsSettingsRouter = require("./admin/settings/web_setting_management/sms_settings/routes");
router.use("/settings/smsSettingManagement", smsSettingsRouter);
// PG setting Management
const pgSettingsRouter = require("./admin/settings/web_setting_management/pg_settings/routes");
router.use("/settings/pgSettingManagement", pgSettingsRouter);
// Terms of Use
const termsOfUseRouter = require("./admin/settings/terms_management/terms_of_use/routes");
router.use("/settings/termsOfUse", termsOfUseRouter);
// Privacy Policy
const privacyPolicyRouter = require("./admin/settings/terms_management/privacy_policy/routes");
router.use("/settings/privacyPolicy", privacyPolicyRouter);
// Payment and Refund Policy
const paymentAndRefundPolicyRouter = require("./admin/settings/terms_management/payment_and_refund_policy/routes");
router.use("/settings/paymentAndRefundPolicy", paymentAndRefundPolicyRouter);
// Promotion Terms and Conditions
const promotionTermsAndConditionsRouter = require("./admin/settings/terms_management/promotion_terms_and_conditions/routes");
router.use(
  "/settings/promotionTermsAndConditions",
  promotionTermsAndConditionsRouter
);
// Holiday Management
const holidayManagementRouter = require("./admin/settings/holiday_management/routes");
router.use("/settings/holidayManagement", holidayManagementRouter);
// Menu Permission Management
const menuPermissionManagementRouter = require("./admin/settings/menu_permission_management/routes");
router.use(
  "/settings/menuPermissionManagement",
  menuPermissionManagementRouter
);

// Study_Time
const studyTimeRouter = require("./study_time/routes");
router.use("/studyTime", studyTimeRouter);

// User Management
const accountUserRouter = require("./admin/user_management/routes");
router.use("/account/user", accountUserRouter);

// Contents Management
// Book Contents
const bookContentsRouter = require("./admin/contents_management/book/routes");
router.use("/bookContents", bookContentsRouter);
// Curriculum Contents
const curriculumContentsRouter = require("./admin/contents_management/curriculum/routes");
router.use("/curriculumContents", curriculumContentsRouter);
// Curriculum Book Relationships
const curriculumBookRelationshipsRouter = require("./admin/contents_management/curriculum/curriculum_book_relationships/routes");
router.use("/curriculumBookRelationships", curriculumBookRelationshipsRouter);

// Product Management
// Regular Product
const regularProductRouter = require("./admin/product_management/regular_product/routes");
router.use("/regularProduct", regularProductRouter);
// Free Trial Product
const freeTrialProductRouter = require("./admin/product_management/free_trial_product/routes");
router.use("/freeTrialProduct", freeTrialProductRouter);

// Payment Management
const paymentManagmentRouter = require("./admin/payment_management/routes");
router.use("/paymentManagement", paymentManagmentRouter);

// Assignment Regular
const assignmentRegularRouter = require("./admin/assignment/regular/routes");
router.use("/assignmentRegular", assignmentRegularRouter);

// Class Management
// Regular Class
const regularClassRouter = require("./admin/class_management/regular_class/routes");
router.use("/regularClass", regularClassRouter);
// Free Trial Class
const freeTrialClassRouter = require("./admin/class_management/free_trial_class/routes");
router.use("/freeTrialClass", freeTrialClassRouter);

// Website Management
// Coupon
const couponRouter = require("./admin/website_management/coupon/routes");
router.use("/coupon", couponRouter);
// Banner
const bannerRouter = require("./admin/website_management/banner/routes");
router.use("/banner", bannerRouter);
// Board Notice
const boardNoticeRouter = require("./admin/website_management/board/notice/routes");
router.use("/board/notice", boardNoticeRouter);
// Board FQA
const boardFAQRouter = require("./admin/website_management/board/faq/routes");
router.use("/board/faq", boardFAQRouter);
// Board Support
const boardSupportRouter = require("./admin/website_management/board/support/routes");
router.use("/board/support", boardSupportRouter);

// Country
const countryRouter = require("./country/routes");
router.use("/country", countryRouter);

// Authority
const authorityRouter = require("./admin/authority/routes");
router.use("/admin/authority", authorityRouter);

// Teacher Management
// Account
const accountTeacherRouter = require("./admin/teacher_management/account/routes");
router.use("/account/teacher", accountTeacherRouter);
// Working Hours
const workingHoursRouter = require("./admin/teacher_management/working_hours/routes");
router.use("/workingHours", workingHoursRouter);
// Vacation and Resignation Management
const vacationAndResignationManagementRouter = require("./admin/teacher_management/vacation_and_registration_management/routes");
router.use(
  "/vacationAndResignationManagement",
  vacationAndResignationManagementRouter
);
// Point and Penalty Management
const pointAndPenaltyManagementRouter = require("./admin/teacher_management/point_and_penalty_management/routes");
router.use("/pointAndPenaltyManagement", pointAndPenaltyManagementRouter);
// Class Feedback
const classFeedbackRouter = require("./admin/teacher_management/class_feedback/routes");
router.use("/classFeedback", classFeedbackRouter);
// Payment
const paymentRouter = require("./admin/teacher_management/payment/routes");
router.use("/payment", paymentRouter);

// Role Management
const roleManagementRouter = require("./admin/role_management/routes");
router.use("/roleManagement", roleManagementRouter);

// Teacher
// Dashboard
const dashboardTeacherRouter = require("./teacher/dashboard/routes");
router.use("/teacher/dashboard", dashboardTeacherRouter);
// Assignment Status
const assginmentASTeacherRouter = require("./teacher/assignment_status/routes");
router.use("/teacher/assignment", assginmentASTeacherRouter);
// Class Management
const regularClassTeacherRouter = require("./teacher/class_management/regular/routes");
router.use("/teacher/class_management/regular", regularClassTeacherRouter);

module.exports = router;
