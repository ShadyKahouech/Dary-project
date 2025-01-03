const { User } = require("../indexdatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    users.length === 0
      ? res.status(404).json({ message: "No users found" })
      : res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: err.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    !user
      ? res.status(404).json({ message: "This user is not found" })
      : res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve a user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.destroy({ where: { id: userId } });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Deleted user with ID: " + userId });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error.message,
    });
  }
};

const SignIn = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, image } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^_\s]{6,}$/.test(
      password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one digit.",
      });
    }
    // Check if the email is already used
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      image,
      password: hashedPassword,
    });
    // Generate JWT this the parameter that we can include when we generate the token for the user
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      secret,
      { expiresIn: "1h" }
    );
    return res.status(201).json({ token, message: "Sign In successful", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  deleteUser,
  SignIn,
};
