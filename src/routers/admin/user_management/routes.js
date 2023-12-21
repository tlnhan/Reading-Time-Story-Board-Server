const express = require("express");
const accountUserController = require("../../../controllers/admin/user_management/controller");

const router = express.Router();

router.post("/", accountUserController.AccountUser);

module.exports = router;