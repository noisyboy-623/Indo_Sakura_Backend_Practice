const AdminService = require("../services/admin.service");
const adminService = new AdminService();
const ApiResponse = require("../../../utils/ApiResponse.js");
const logger = require("../../../utils/logger.js");

const loginAdmin = async (req, res) => {
  try {
    logger.info("Login attempt", {
      email: req.body.email,
    });
    const data = await adminService.loginAdmin(req.body);

    logger.info("User logged in successfully", {
      userId: data.admin._id,
      username: data.admin.username,
    });
    return res
      .status(200)
      .json(ApiResponse(200, data, "User logged in successfully"));
  } catch (error) {
    logger.error("Error in loginAdmin controller", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

const changeAdminPass = async (req, res) => {
  try {
    logger.info("Password change attempt", {
      email: req.user.email,
      role: req.user.role,
    });
    const adminData = {
      ...req.body,
      id: req.user.id,
    };
    const data = await adminService.changeAdminPass(adminData);
    logger.info("Password changed successfully", {
      userId: data._id,
      role: data.role,
    });
    return res
      .status(200)
      .json(ApiResponse(200, data, "Password changed successfully"));
  } catch (error) {
    logger.error("Error in changeAdminPass controller", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.id;

    logger.info("Approve user request received", {
      userId,
      adminId,
      role: req.user.role,
    });

    const data = await adminService.approveUser(
      userId,
      adminId
    );

    return res
      .status(200)
      .json(
        ApiResponse(
          200,
          data,
          "User approved successfully"
        )
      );
  } catch (error) {
    logger.error("Error in approveUser controller", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      userId: req.params.id,
      adminId: req.user?.id,
    });

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};
module.exports = { loginAdmin, changeAdminPass, approveUser };
