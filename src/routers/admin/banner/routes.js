const express = require("express");
const bannerController = require("../../../controllers/admin/banner/controller");

const router = express.Router();

router.post("/", bannerController.Banner);

module.exports = router;