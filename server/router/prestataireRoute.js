const express = require("express");
const {
  getAllPrestataire,
  getOnePrestataire,
  registerPrestataire,
  updatePrestataire,
  // verifyToken,
  loginPrestataire,
  deletePrestataire,
} = require("../controller/prestataireControlleur");

const route = express.Router();

route.get("/getallprestataire", getAllPrestataire);
route.get("/getoneprestataire/:id", getOnePrestataire);
route.delete("/delete/:id", deletePrestataire);
route.post("/registerprestataire", registerPrestataire);
route.post("/login", loginPrestataire);
route.put("/updatprestataire/:id", updatePrestataire);

module.exports = route;
