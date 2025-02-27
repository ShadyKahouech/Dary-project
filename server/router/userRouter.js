const express = require("express");
const { authenticate } = require("../service/config");
const passport = require("../service/Passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const route = express.Router();
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  registerUser,
  loginUser,
  updateUser,
} = require("../controller/userController");
const passportUser = require("../service/Passport");

// this one work
route.get(
  "/getallusers",

  getAllUsers
);
route.get(
  "/getoneuser/:id",
  passportUser.authenticate("jwt", { session: false }),
  getOneUser
);

route.delete(
  "/deleteuser/:id",
  passportUser.authenticate("jwt", { session: false }),
  deleteUser
);
route.post("/register", registerUser);
route.post("/login", loginUser);
route.put(
  "/updateuser/:id",
  passportUser.authenticate("jwt", { session: false }),
  updateUser
);

module.exports = route;
