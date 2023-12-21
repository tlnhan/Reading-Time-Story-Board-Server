const express = require("express");
const accountTeacherController = require("../../../../controllers/admin/teacher_management/account/controller");

const router = express.Router();

router.post("/", accountTeacherController.AccountTeacher);

module.exports = router;