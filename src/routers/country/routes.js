const express = require("express");
const countryController = require("../../controllers/country/controller");

const router = express.Router();

router.post("/", countryController.Country);

module.exports = router;
