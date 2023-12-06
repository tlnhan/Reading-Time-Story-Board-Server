const express = require("express");
const boardSupportController = require("../../../../controllers/admin/board/support/controller");

const router = express.Router();

router.post("/", boardSupportController.BoardSupport);

module.exports = router;