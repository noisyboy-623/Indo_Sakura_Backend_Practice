const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError.js")
const logger = require("../../../utils/logger.js");

class UserService {
  // createUser
  async createUser(data) {
    try {
      logger.debug("Checking if user already exists", {
        username: data.username,
        email: data.email,
      });

      const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email: data.email }, { username: data.username }],
      });

      if (isUserAlreadyExists) {
        logger.warn("User registration rejected: user already exists", {
          username: data.username,
          email: data.email,
        });

        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
      }
      logger.debug("Hashing user password");

      const hash = await bcrypt.hash(data.password, 10);

      const user = await userModel.create({
        username: data.username,
        email: data.email,
        password: hash,
      });
      logger.info("User saved to database", {
        userId: user._id,
        username: user.username,
      });

      return user;
    } catch (error) {
      logger.error("Error in createUser service", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  //loginUser
  async loginUser(data) {
    try {
      logger.debug("Searching for user", {
        email: data.email,
        username: data.username,
      });

      const user = await userModel
        .findOne({
          $or: [{ email: data.email }, { username: data.username }],
        })
        .select("+password");

      if (!user) {
        logger.warn("Login failed: user not found", {
          email: data.email,
          username: data.username,
        });
        throw ApiError(400, "Invalid Credentials");
      }

      logger.debug("User found, verifying password", {
        userId: user._id,
      });

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
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
        userId: user._id,
      });

      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "3d",
        },
      );

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "15m",
        },
      );
      logger.info("Login successful", {
        userId: user._id,
        username: user.username,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Error in loginUser service", {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
      });
      throw error;
    }
  }

  // getUsers
  async getUsers() {
    try {
      const users = await userModel.find({
        isActive: true,
        deletedAt: null,
      });

      return users;
    } catch (error) {
      console.log("Error in getUsers service:", error);
      throw error;
    }
  }

  // getUser
  async getUser(id) {
    try {
      const user = await userModel.findById(id);

      return user;
    } catch (error) {
      console.log("Error in getUser service:", error);
      throw error;
    }
  }

  // getUserByUsername
  async getUserByUsername(username) {
    try {
      const user = await userModel.findOne({
        username,
      });

      return user;
    } catch (error) {
      console.log("Error in getUserByUsername service:", error);
      throw error;
    }
  }

  // getDeletedUsers
  async getDeletedUsers() {
    try {
      const users = await userModel.find({
        deletedAt: {
          $ne: null,
        },
        isActive: false,
      });

      return users;
    } catch (error) {
      console.log("Error in getDeletedUsers service:", error);
      throw error;
    }
  }

  // deleteUser
  async deleteUser(id) {
    try {
      await userModel.findByIdAndUpdate(id, {
        deletedAt: new Date(),
        isActive: false,
      });
    } catch (error) {
      console.log("Error in deleteUser service:", error);
      throw error;
    }
  }

  // updateUser
  async updateUser(id, data) {
    try {
      const user = await userModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      return user;
    } catch (error) {
      console.log("Error in updateUser service:", error);
      throw error;
    }
  }
}

module.exports = UserService;
