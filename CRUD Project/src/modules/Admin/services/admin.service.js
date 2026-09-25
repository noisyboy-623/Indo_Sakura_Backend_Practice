const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const logger = require("../../../utils/logger.js");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError.js")

class AdminService {
async createSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL
    const password = process.env.SUPER_ADMIN_PASSWORD

    if(!email || !password){
        throw new Error("Super admin credentials missing")
    }

    const superAdminExist = await adminModel.findOne({email})

    if(superAdminExist){
        console.log("Super admin already exist")
        return
    }

    const hashPass = await bcrypt.hash(password, 10)

    await adminModel.create({
        email,
        password: hashPass,
        role: "SUPER_ADMIN"
    })

    console.log("Super Admin created successfully")
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
        process.env.ADMIN_ACCESS_SECRET,
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
}
module.exports = AdminService