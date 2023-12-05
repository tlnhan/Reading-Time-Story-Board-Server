const express = require("express");
const menuPermissionManagementController = require("../../../../controllers/admin/settings/menu_permission_management/controller");

const router = express.Router();

router.post("/", menuPermissionManagementController.MenuPermissionManagement);

module.exports = router;