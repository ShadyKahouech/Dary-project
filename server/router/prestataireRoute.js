const express = require("express");
const {
  getAllPrestataire,
  getOnePrestataire,
  registerPrestataire,
  verifyToken,
  loginPrestataire,
  deletePrestataire,
} = require("../controller/prestataireControlleur");

const route = express.Router();

route.get("/getallprestataire", getAllPrestataire);
route.get("/getoneprestataire", verifyToken, getOnePrestataire);
route.delete("/delete/:id", deletePrestataire);
route.post("/registerprestataire", registerPrestataire);
route.post("/login", loginPrestataire);

module.exports = route;
