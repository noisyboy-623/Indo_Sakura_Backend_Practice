const UserService = require("../services/user.service");
const ApiResponse = require("../../../utils/ApiResponse.js");
const userService = new UserService();
const registerSchema = require("../validation/auth.validation")
const logger = require("../../../utils/logger.js");

// createUser controller
const createUser = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      logger.warn("User registration validation failed", {
        error: error.details[0].message,
      });

      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    logger.info("Creating new user", {
      username: value.username,
      email: value.email,
    });

    const user = await userService.createUser(value);

    logger.info("User created successfully", {
      username: user.username,
      email: user.email,
    });

    return ApiResponse(201, user, "User created successfully").send(res);
  } catch (error) {
    logger.error("Error in createUser controller", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    logger.info("Login attempt", {
      email: req.body.email,
      username: req.body.username,
    });
    const data = await userService.loginUser(req.body);
    // res.status(200).json({
    //   message: "User logged in successfully",
    //   user: data.user,
    //   accessToken: data.accessToken,
    //   refreshToken: data.refreshToken,
    // });
    logger.info("User logged in successfully", {
      userId: data.user._id,
      username: data.user.username,
    });
    return res
      .status(200)
      .json(ApiResponse(200, data, "User logged in successfully"));
  } catch (error) {
     logger.error("Error in loginUser controller", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

// getUsers controller
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in getUsers controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// getUser controller
const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error in getUser controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// getUserByUsername controller
const getUserByUsername = async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error in getUserByUsername controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// getDeletedUsers controller
const getDeletedUsers = async (req, res) => {
  try {
    const users = await userService.getDeletedUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in getDeletedUsers controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// deleteUser controller
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteUser controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// updateUser controller
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error in updateUser controller:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUser,
  getUserByUsername,
  getDeletedUsers,
  deleteUser,
  updateUser,
};
