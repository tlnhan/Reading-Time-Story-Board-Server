const express = require("express");
const bookContentsController = require("../../../../controllers/admin/contents_management/book/controller");

const router = express.Router();

router.post("/", bookContentsController.BookContent);

module.exports = router;