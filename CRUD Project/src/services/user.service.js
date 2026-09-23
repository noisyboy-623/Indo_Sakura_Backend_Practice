const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService{

// createUser
async createUser(data){
  try {
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (isUserAlreadyExists) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await userModel.create({
      username: data.username,
      email: data.email,
      password: hash,
    });

    return user;
  } catch (error) {
    console.log("Error in createUser service:", error);
    throw error;
  }
};

//loginUser
async loginUser(data){
  try {
    const user = await userModel
      .findOne({
        $or: [{ email: data.email }, { username: data.username }],
      })
      .select("+password");

    if (!user) {
      throw ApiError(400, "Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      {
        const error = new Error("Invalid Credentials");
        error.statusCode = 400;
        throw error;
      }
    }

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

    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error in createUser service:", error);
    throw error;
  }
};

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
};

// getUser
async getUser(id) {
  try {
    const user = await userModel.findById(id);

    return user;
  } catch (error) {
    console.log("Error in getUser service:", error);
    throw error;
  }
};

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
};

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
};

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
};

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
};
}

module.exports = UserService
