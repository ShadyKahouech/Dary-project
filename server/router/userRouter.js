const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  registerUser,
  // verifyToken,
  loginUser,
  updateUser,
} = require("../controller/userController");

const route = express.Router();

route.get("/getallusers", getAllUsers);
route.get("/getoneuser/:id", getOneUser);
route.delete("/deleteuser/:id", deleteUser);
route.post("/register", registerUser);
route.post("/loginuser", loginUser);
route.put("/updateuser/:id", updateUser);
module.exports = route;
