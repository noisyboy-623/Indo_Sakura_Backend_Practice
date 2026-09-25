class UserTestCtrl{
    async createUser(req, res){
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Error in createUser controller:", error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};
}

module.exports=UserTestCtrl