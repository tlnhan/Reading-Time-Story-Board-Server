const express = require("express");
const bookContentsController = require("../../../controllers/admin/book/controller");

const router = express.Router();

router.post("/", bookContentsController.BookContents);

module.exports = router;