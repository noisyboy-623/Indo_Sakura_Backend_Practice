require("dotenv").config();

const app = require("./app");
const connectDB = require("./db/connection");
const AdminService = require("./modules/Admin/services/admin.service");
const adminService = new AdminService();


adminService.createSuperAdmin();
connectDB();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
