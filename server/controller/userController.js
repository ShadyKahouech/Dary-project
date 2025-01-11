const { User } = require("../indexdatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

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

// const SignIn = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role, image } = req.body;

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     if (!image && role === "prestataire") {
//       return res.status(400).send("At least 1 images are required.");
//     }

//     let uploadedPromises = cloudinary.uploader
//       .upload(image, {
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//         resource_type: "auto",
//       })
//       .then((result) => {
//         console.log("Image uploaded successfully:", result.secure_url);
//       })
//       .catch((error) => {
//         console.error("Error uploading image:", error);
//       });

//     const uploadedResults = await Promise.all(uploadedPromises);
//     console.log("uploaded images:", uploadedResults);

//     // Password validation
//     const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^_\s]{6,}$/.test(
//       password
//     );
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         message:
//           "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one digit.",
//       });
//     }
//     // Check if the email is already used
//     const userExist = await User.findOne({ where: { email } });
//     if (userExist) {
//       return res.status(400).json({ message: "Email is already in use" });
//     }

//     // Create a new user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       role,
//       image: uploadedResults,
//       password: hashedPassword,
//     });
//     // Generate JWT this the parameter that we can include when we generate the token for the user
//     const token = jwt.sign(
//       {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         image: user.image,
//       },
//       secret,
//       { expiresIn: "1h" }
//     );

//     return res.status(201).json({ token, message: "Sign In successful", user });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };

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

const SignIn = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, image } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate image for "prestataire" role
    if (role === "prestataire" && !image) {
      return res.status(400).json({ message: "An image is required." });
    }

    // Check if the email is already in use
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Email is already in use" });
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      image: uploadedImageUrl,
      password: hashedPassword,
    });

    // Generate JWT
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

// login existing user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Invalid email or password" });
    }
    // compare the password:
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(404).json({ message: "Invalid email or password" });
    }
    // generate token
    const token = jwt.sign(
      {
        email: user.email,
        password: user.password,
      },
      secret,
      { expiresIn: "1h" }
    );
    return res.json({ token });
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
  verifyToken,
  loginUser,
};
