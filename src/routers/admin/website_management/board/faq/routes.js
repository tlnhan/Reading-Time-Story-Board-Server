const express = require("express");
const boardFAQController = require("../../../../../controllers/admin/website_management/board/faq/controller");

const router = express.Router();

router.post("/", boardFAQController.BoardFAQ);

module.exports = router;