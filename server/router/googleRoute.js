const express = require("express");
const { authenticate } = require("../service/config");
const passportUser = require("../service/Passport");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const route = express.Router();

// redirect to google for authentification

route.get(
  "/",
  passportUser.authenticate("google", { scope: ["openid", "profile", "email"] })
);

//  Google callback route
//
route.get(
  "/login",
  passportUser.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3001/login",
  }),
  (req, res) => {
    try {
      console.log("Utilisateur authentifié :", req.user);

      if (!req.user) {
        throw new Error("Utilisateur non trouvé après authentification");
      }

      const token = jwt.sign(
        { id: req.user.userId, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("Token généré :", token);

      res.redirect(`http://localhost:3001/google?token=${token}`);
    } catch (error) {
      console.error("Erreur lors de l'authentification Google :", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de l'authentification Google" });
    }
  }
);

module.exports = route;
