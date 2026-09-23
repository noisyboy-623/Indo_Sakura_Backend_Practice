const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authValidator = require("../validator/auth.validator")
// const UserTestCtrl = require("../controllers/user.ctrl.class");
// const userTestCtrl = new UserTestCtrl()

const router = express.Router();

// POST /api/users/register
router.post("/register", authValidator.registerValidator, userController.createUser);
// router.post("/register", userTestCtrl.createUser);

// POST /api/users/login
router.post("/login", authValidator.loginValidator, userController.loginUser);

// GET /api/users
router.get("/", authMiddleware, userController.getUsers);

// GET /api/users/deletedUsers
router.get("/deletedUsers", authMiddleware, userController.getDeletedUsers);

// GET /api/users/username/:username
router.get("/username/:username", authMiddleware, userController.getUserByUsername);

// GET /api/users/:id
router.get("/:id", authMiddleware, userController.getUser);

// PATCH /api/users/:id
router.patch("/:id", authMiddleware, userController.updateUser);

// DELETE /api/users/:id
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
