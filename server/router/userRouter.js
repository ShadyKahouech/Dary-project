const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
} = require("../controller/userController");

const route = express.Router();

route.get("/getAllUsers", getAllUsers);
route.get("/getOneUser", getOneUser);
route.delete("/deleteUser/:id", deleteUser);
module.exports = route;
