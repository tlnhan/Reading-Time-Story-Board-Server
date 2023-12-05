const express = require("express");
const accountUserController = require("../../../../controllers/admin/account/user/controller");

const router = express.Router();

router.post("/", accountUserController.AccountUser);

module.exports = router;