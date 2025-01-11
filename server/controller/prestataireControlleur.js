const { Prestataire } = require("../indexdatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const getAllPrestataire = async (req, res) => {
  try {
    const prestataires = await Prestataire.findAll();
    prestataires.length === 0
      ? res.status(404).json({ message: "No prestataires found" })
      : res.status(200).send(prestataires);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve prestataire",
      error: error.message,
    });
  }
};

const getOnePrestataire = async (req, res) => {
  try {
    const onePrestataire = await Prestataire.findByPk(req.params.id);
    !onePrestataire
      ? res.status(404).json({ message: "This Prestataire is not found" })
      : res.status(200).json(onePrestataire);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve a user", error: err.message });
  }
};
const deletePrestataire = async (req, res) => {
  try {
    const prestataireId = req.body.id;
    const deleted = await Prestataire.destroy({ where: { id: prestataireId } });
    if (!deleted) {
      res.status(404).json({ message: "Prestataire not found" });
    }
    res
      .status(200)
      .json({ message: `Prestataire with id : ${id} was deleted` });
  } catch (err) {}
  res.status(500).json({
    message: "An error occurred while deleting user",
    error: error.message,
  });
};

const registerPrestataire = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      isActive,
      isConfirmed,
      photoOfCin,
      photoOfDriverLicence,
      role,
      carteGrise,
      experience,
      password,
    } = req.body;

    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^_\s]{6,}$/.test(
      password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Password does not meet the criteria" });
    }

    const existingPrestataire = await Prestataire.findOne({ where: { email } });

    if (existingPrestataire) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPrestataire = await Prestataire.create({
      firstName,
      lastName,
      email,
      mobile,
      isActive,
      isConfirmed,
      photoOfCin,
      photoOfDriverLicence,
      role,
      carteGrise,
      experience,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newPrestataire.id,
        firstName: newPrestataire.firstName,
        lastName: newPrestataire.lastName,
        email: newPrestataire.email,
        role: newPrestataire.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, message: "SignUp successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error", error: err.message });
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
    req.existingPrestataire = {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(403).json({
      status: "fail",
      message: "Invalid token.",
    });
  }
};

// login existing Prestataire

const loginPrestataire = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find user by email
    const prestataire = await Prestataire.findOne({ where: { email } });
    if (!prestataire) {
      res.status(404).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      prestataire.password
    );
    if (!isPasswordValid) {
      res.status(404).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        email: prestataire.email,
        password: prestataire.password,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).send({ token, message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllPrestataire,
  getOnePrestataire,
  registerPrestataire,
  verifyToken,
  loginPrestataire,
  deletePrestataire,
};
