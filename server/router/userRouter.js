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

route.get("/getallusers", verifyToken, getAllUsers);
route.get("/getoneuser", verifyToken, getOneUser);
route.delete("/deleteuser/:id", verifyToken, deleteUser);
route.post("/signin", SignIn);
route.post("/loginUser", loginUser);
module.exports = route;
