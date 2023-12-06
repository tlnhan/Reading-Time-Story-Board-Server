const express = require("express");
const accountTeacherController = require("../../../../controllers/admin/account/teacher/controller");

const router = express.Router();

router.post("/", accountTeacherController.AccountTeacher);

module.exports = router;