const UserService = require("../services/user.service");
const { default: ApiResponse } = require("../utils/ApiResponse");
const userService = new UserService();

// createUser controller
const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    return ApiResponse(201, user, "User created successfully").send(res);
  } catch (error) {
    console.log("Error in createUser controller:", error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = await userService.loginUser(req.body);
    // res.status(200).json({
    //   message: "User logged in successfully",
    //   user: data.user,
    //   accessToken: data.accessToken,
    //   refreshToken: data.refreshToken,
    // });
    return res
      .status(200)
      .json(ApiResponse(200, data, "User logged in successfully"));
  } catch (error) {
    console.log("Error in loginUser controller:", error);

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
