const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const logger = require("../../../utils/logger.js");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError.js");
const userModel = require("../../User/models/user.model.js");

class AdminService {
  async createSuperAdmin() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    logger.info("Checking Super Admin configuration");

    if (!email || !password) {
      logger.error("Super Admin credentials are missing");
      throw ApiError(500, "Super admin credentials missing");
    }

    const superAdminExist = await adminModel.findOne({ email });

    if (superAdminExist) {
      logger.info("Super Admin already exists", {
        adminId: superAdminExist._id,
        email: superAdminExist.email,
      });

      return;
    }

    const hashPass = await bcrypt.hash(password, 10);

    const superAdmin = await adminModel.create({
      email,
      password: hashPass,
      role: "SUPER_ADMIN",
    });

    logger.info("Super Admin created successfully", {
      adminId: superAdmin._id,
      email: superAdmin.email,
      role: superAdmin.role,
    });

    return superAdmin;
  } catch (err) {
    logger.error("Error while creating Super Admin", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });

    throw err;
  }
}

  async loginAdmin(data) {
    try {
      logger.debug("Searching for admin", {
        email: data.email,
      });

      const admin = await adminModel
        .findOne({
          $or: [{ email: data.email }],
        })
        .select("+password");

      if (!admin) {
        logger.warn("Login failed: user not found", {
          email: data.email,
          username: data.username,
        });
        throw ApiError(400, "Invalid Credentials");
      }

      logger.debug("User found, verifying password", {
        userId: admin._id,
      });

      const isPasswordValid = await bcrypt.compare(
        data.password,
        admin.password,
      );

      if (!isPasswordValid) {
        {
          logger.warn("Login failed: invalid password", {
            userId: user._id,
            username: user.username,
          });

          throw ApiError(400, "Invalid Credentials");
        }
      }

      logger.debug("Password verified, generating tokens", {
        userId: admin._id,
      });

      //   const refreshToken = jwt.sign(
      //     {
      //       id: admin._id,
      //     },
      //     process.env.JWT_REFRESH_SECRET,
      //     {
      //       expiresIn: "3d",
      //     },
      //   );

      const accessToken = jwt.sign(
        {
          id: admin._id,
          username: admin.username,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "15m",
        },
      );
      logger.info("Login successful", {
        userId: admin._id,
        username: admin.username,
      });

      return {
        admin,
        accessToken,
      };
    } catch (error) {
      logger.error("Error in loginAdmin service", {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
      });
      throw error;
    }
  }

  async changeAdminPass(data) {
    try {
      const admin = await adminModel.findById(data.id).select("+password");
      if (!admin) {
        throw ApiError(400, "Invalid Admin");
      }
      const isPassValid = await bcrypt.compare(data.password, admin.password);
      if (!isPassValid) {
        {
          logger.warn("invalid password", {
            userId: admin._id,
          });

          throw ApiError(400, "Invalid Credentials");
        }
      }
      if (data.newPassword !== data.confirmPassword) {
        logger.warn("Passwords do not match", {
          userId: admin._id,
        });

        throw ApiError(400, "Passwords do not match");
      }
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      const updatedAdmin = await adminModel.findByIdAndUpdate(
        admin.id,
        {
          password: hashedPassword,
        },
        {
          new: true,
        },
      );

      return updatedAdmin;
    } catch (err) {
      throw err;
    }
  }

  async approveUser(userId, adminId) {
  try {
    logger.info("User approval attempt", {
      userId,
      adminId,
    });

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      logger.warn("Admin not found", {
        adminId,
      });

      throw ApiError(404, "Admin not found");
    }

    if (admin.role !== "SUPER_ADMIN") {
      logger.warn("Unauthorized user approval attempt", {
        adminId,
        role: admin.role,
      });

      throw ApiError(403, "Access denied");
    }

    const approvedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isActive: true,
      },
      {
        new: true,
      }
    );

    if (!approvedUser) {
      logger.warn("User not found for approval", {
        userId,
      });

      throw ApiError(404, "User not found");
    }

    logger.info("User approved successfully", {
      userId: approvedUser._id,
      approvedBy: admin._id,
    });

    return approvedUser;
  } catch (err) {
    logger.error("Error in approveUser service", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      userId,
      adminId,
    });

    throw err;
  }
}
}
module.exports = AdminService;
