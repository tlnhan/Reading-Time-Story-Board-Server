const express = require("express");
const regularProductController = require("../../../controllers/admin/regular_product/controller");

const router = express.Router();

router.post("/", regularProductController.RegularProduct);

module.exports = router;