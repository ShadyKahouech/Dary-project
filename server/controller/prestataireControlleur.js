const { Prestataire } = require("../indexdatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { generateToken } = require("../service/generateToken");
const passport = require("../service/passportPrestataire");

const getAllPrestataire = async (req, res) => {
  try {
    const prestataires = await Prestataire.findAll();
    prestataires.length === 0
      ? res
          .status(404)
          .json({ message: "There is no prestataire in your list" })
      : res.status(200).send(prestataires);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve prestataires list",
      error: error.message,
    });
  }
};
const getOnePrestataire = async (req, res) => {
  try {
    const onePrestataire = await Prestataire.findByPk(req.params.id);

    !onePrestataire
      ? res.status(400).json({ message: "This prestataire didn't exist" })
      : res.status(200).send(onePrestataire);
  } catch (error) {
    res.status(500).json({
      message: "this prestataire didn't exist",
      error: error.message,
    });
  }
};
const deletePrestataire = async (req, res) => {
  try {
    const prestataireId = req.params.id;

    if (!prestataireId) {
      return res.status(400).json({ message: "Prestataire ID is required" });
    }

    const deleted = await Prestataire.destroy({ where: { prestataireId } });

    if (!deleted) {
      return res.status(404).json({ message: "Prestataire not found" });
    }

    return res
      .status(200)
      .json({ message: `Prestataire with ID: ${prestataireId} was deleted` });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting prestataire",
      error: error.message,
    });
  }
};

const registerPrestataire = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      isActive,
      image,
      images_truck,
      photoOfCin,
      photoOfDriverLicence,
      carteGrise,
      role,
      truck_type,
      experience,
      price,
      discountedPrice,
    } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email is already in use
    const prestataireExist = await Prestataire.findOne({ where: { email } });
    if (prestataireExist) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Validate password format
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

    // Create Prestataire entry
    const prestataire = await Prestataire.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      isActive,
      image,
      images_truck,
      photoOfCin,
      photoOfDriverLicence,
      carteGrise,
      role,
      truck_type,
      experience,
      price,
      discountedPrice,
    });

    // Generate token for the registered Prestataire
    const token = generateToken(prestataire);

    return res
      .status(201)
      .json({ token, message: "Sign Up successful", prestataire });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const loginPrestataire = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (err, prestataire, info) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Server error", error: err.message });
      }
      if (!prestataire) {
        return res
          .status(401)
          .json({ message: info.message || "Invalid credentials" });
      }

      // Générer un token JWT pour le prestataire
      const token = generateToken(prestataire);
      return res.json({ token, message: "Login successful" });
    }
  )(req, res, next);
};

const updatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      isActive,
      image,
      images_truck,
      photoOfCin,
      photoOfDriverLicence,
      carteGrise,
      role,
      truck_type,
      experience,
      price,
      discountedPrice,
    } = req.body;
    // Validate images_truck
    if (
      !images_truck ||
      !Array.isArray(images_truck) ||
      images_truck.length < 3
    ) {
      return res.status(400).send("At least 3 images are required.");
    }

    // Validate and upload images_truck to Cloudinary
    const uploadedPromises = images_truck.map((image_truck) =>
      cloudinary.uploader.upload(image_truck, {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        resource_type: "auto",
      })
    );

    const uploadedResults = await Promise.all(uploadedPromises);
    const newarray = uploadedResults.map((el) => el.secure_url);

    // Upload single image fields to Cloudinary
    const uploadSingleImage = async (imageField) => {
      if (imageField) {
        const result = await cloudinary.uploader.upload(imageField, {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          resource_type: "auto",
        });
        return result.secure_url;
      }
      return null;
    };

    const uploadedImageUrl = await uploadSingleImage(image);
    const uploadedPhotoOfCin = await uploadSingleImage(photoOfCin);
    const uploadedPhotoOfDriverLicence = await uploadSingleImage(
      photoOfDriverLicence
    );
    const uploadedCarteGrise = await uploadSingleImage(carteGrise);
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const [update] = await Prestataire.update(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobile,
        isActive,
        image: uploadedImageUrl,
        images_truck: newarray,
        photoOfCin: uploadedPhotoOfCin,
        photoOfDriverLicence: uploadedPhotoOfDriverLicence,
        carteGrise: uploadedCarteGrise,
        role,
        truck_type,
        experience,
        price,
        discountedPrice,
      },
      { where: { prestataireId: id } }
    );
    if (update) {
      res.status(200).send({ message: "Prestaire updated successfully" });
    } else {
      res.status(404).send({ message: "Prestataire is not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the prestataire");
  }
};

module.exports = {
  getAllPrestataire,
  getOnePrestataire,
  registerPrestataire,
  loginPrestataire,
  deletePrestataire,
  updatePrestataire,
};
