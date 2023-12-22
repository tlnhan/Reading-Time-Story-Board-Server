const express = require("express");
const boardNoticeController = require("../../../../../controllers/admin/website_management/board/notice/controller");

const router = express.Router();

router.post("/", boardNoticeController.BoardNotice);

module.exports = router;