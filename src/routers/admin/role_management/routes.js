const express = require("express");
const roleManagementController = require("../../../controllers/admin/role_management/controller");

const router = express.Router();

router.post("/", roleManagementController.RoleManagement);

module.exports = router;