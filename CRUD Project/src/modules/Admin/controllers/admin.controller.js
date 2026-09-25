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

module.exports = { loginAdmin };
