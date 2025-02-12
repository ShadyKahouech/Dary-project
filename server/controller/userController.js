const { User } = require("../indexdatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { generateTokenUser } = require("../service/generateToken");
const { getUrlImage } = require("../service/cloudinary");
const passport = require("../service/Passport");

const secret = process.env.JWT_SECRET;

const isValidImageUrl = (url) => {
  const urlPattern = new RegExp(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|tiff))$/i
  );
  return urlPattern.test(url);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    users.length === 0
      ? res.status(404).json({ message: "No users found" })
      : res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    !user
      ? res.status(404).json({ message: "This user is not found" })
      : res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve this user", error: error.message });
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

// verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      status: "fail",
      message: "Invalid token.",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, image } = req.body;
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // check if the email is already in use
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    // Validate password
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^_\s]{6,}$/.test(
      password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, digit, and be at least 6 characters.",
      });
    }

    // Upload image if provided
    let uploadedImageUrl = null;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        resource_type: "auto",
      });
      uploadedImageUrl = uploadResult.secure_url;
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      image: uploadedImageUrl,
    });

    const token = generateTokenUser(user);
    return res.status(201).json({ token, message: "Sign In successful", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, role, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        resource_type: "auto",
      });
      if (image && !isValidImageUrl(image)) {
        return res.status(400).json({ message: "Image URL is not valid." });
      }
      imageUrl = uploadedImage.secure_url; // Save the uploaded image URL
    }
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const [update] = await User.update(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        image: imageUrl,
      },
      { where: { userId: id } }
    );
    if (update) {
      res.status(200).send({ message: "User updated successfully" });
    } else {
      res.status(404).send({ message: "User is not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the user");
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateTokenUser(user);
    return res.json({ token });
  })(req, res, next);
};

module.exports = {
  getAllUsers,
  getOneUser,
  verifyToken,
  registerUser,
  updateUser,
  loginUser,
  deleteUser,
};
