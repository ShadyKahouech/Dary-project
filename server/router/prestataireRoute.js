// const express = require("express");
// const {
//   getAllPrestataire,
//   getOnePrestataire,
//   registerPrestataire,
//   updatePrestataire,
//   // verifyToken,
//   loginPrestataire,
//   deletePrestataire,
// } = require("../controller/prestataireControlleur");

// const route = express.Router();

// route.get("/getallprestataire", getAllPrestataire);
// route.get("/getoneprestataire/:id", getOnePrestataire);
// route.delete("/delete/:id", deletePrestataire);
// route.post("/registerprestataire", registerPrestataire);
// route.post("/login", loginPrestataire);
// route.put("/updatprestataire/:id", updatePrestataire);

// module.exports = route;

const express = require("express");
const {
  getAllPrestataire,
  getOnePrestataire,
  registerPrestataire,
  updatePrestataire,
  loginPrestataire,
  deletePrestataire,
} = require("../controller/prestataireControlleur");
const passportPrestataire = require("../service/passportPrestataire");
const { authenticate } = require("../service/config");

const route = express.Router();

// Route to get all Prestataires - Public
// this one is also working
route.get("/getallprestataire", getAllPrestataire);

// Route to get a specific Prestataire - Protected (authentication required)
// this one is working
route.get(
  "/getoneprestataire/:id",
  passportPrestataire.authenticate("jwt", { session: false }),
  getOnePrestataire
);

// Route to delete a Prestataire - Protected (authentication required)
// this one working
route.delete(
  "/delete/:id",
  passportPrestataire.authenticate("jwt", { session: false }),
  deletePrestataire
);

//this one is working

// Route to register a new Prestataire - Public
route.post("/registerprestataire", registerPrestataire);

// Route to login a Prestataire - Public
// this one is working also
route.post("/login", loginPrestataire);

// Route to update a Prestataire - Protected (authentication required)
// this one also working
route.put(
  "/updatprestataire/:id",
  passportPrestataire.authenticate("jwt", { session: false }),
  updatePrestataire
);

module.exports = route;
