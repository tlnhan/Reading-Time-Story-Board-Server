const express = require("express");
const accountRoleController = require("../../../../controllers/admin/account/role/controller");

const router = express.Router();

router.post("/", accountRoleController.AccountRole);

module.exports = router;