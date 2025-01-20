const jwt = require("jsonwebtoken");

const generateToken = (prestataire) => {
  if (!prestataire || !prestataire.email || !prestataire.prestataireId) {
    throw new Error(`Invalid ${prestataire} object`);
  }

  const token = jwt.sign(
    {
      email: prestataire.email,
      id: prestataire.prestataireId,
      firstName: prestataire.firstName,
      lastName: prestataire.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};
const generateTokenUser = (user) => {
  if (!user || !user.email || !user.userId) {
    throw new Error(`Invalid ${user} object`);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

module.exports = {
  generateToken,
  generateTokenUser,
};
