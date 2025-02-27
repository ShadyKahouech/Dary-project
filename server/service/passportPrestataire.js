

const { Passport } = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { Prestataire } = require("../indexdatabase");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

const passportPrestataire = new Passport();

// Local Strategy for login (Authentication)
passportPrestataire.use(
  new LocalStrategy(
    {
      usernameField: "email", // prestataire email as the username
      passwordField: "password", // prestataire password field
    },
    async (email, password, done) => {
      try {
        // Find prestataire by email
        const prestataire = await Prestataire.findOne({ where: { email } });
        if (!prestataire) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, prestataire.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, prestataire); // Authentication successful, return the prestataire
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for protecting routes (Authorization)
passportPrestataire.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // The same secret key used to generate the token
    },
    async (jwt_payload, done) => {
      try {
        // Find prestataire by ID from the decoded JWT payload
        const prestataire = await Prestataire.findByPk(jwt_payload.id);
        if (!prestataire) {
          return done(null, false, { message: "Prestataire not found" });
        }
        return done(null, prestataire); // Return the prestataire if found
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passportPrestataire;
