const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfuly");
  } catch (err) {
    console.log("Database connection error", err);
    process.exit(1) // Exit the process with failure
  }
}

module.exports = connectDB