const express = require("express");
const boardSupportController = require("../../../../../controllers/admin/website_management/board/support/controller");

const router = express.Router();

router.post("/", boardSupportController.BoardSupport);

module.exports = router;