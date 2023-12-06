const express = require("express");
const boardFAQController = require("../../../../controllers/admin/board/faq/controller");

const router = express.Router();

router.post("/", boardFAQController.BoardFAQ);

module.exports = router;