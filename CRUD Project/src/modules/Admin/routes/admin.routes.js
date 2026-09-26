const express = require("express");

const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const router = express.Router();

router.post("/login", adminController.loginAdmin);
router.patch("/changeAdminPass", authMiddleware, adminController.changeAdminPass)
router.patch("/users/:id/approve", authMiddleware, adminController.approveUser)
module.exports = router;
