const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  SignIn,
  verifyToken,
  loginUser,
} = require("../controller/userController");

const route = express.Router();

route.get("/getallusers", getAllUsers);
route.get("/getoneuser", getOneUser);
route.delete("/deleteuser/:id", deleteUser);
route.post("/signin", SignIn);
route.post("/loginUser", loginUser);
module.exports = route;
