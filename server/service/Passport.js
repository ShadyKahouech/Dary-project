const { Passport } = require("passport");
const passportUser = new Passport();
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { User } = require("../indexdatabase");

const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

// Local Strategy for login (Authentication)
passportUser.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email as the username
      passwordField: "password", // Use password field
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user); // Authentication successful, return the user
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for protecting routes (Authorization)
passportUser.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // The same secret key used to generate the token
    },
    async (jwt_payload, done) => {
      try {
        // Find user by ID from the decoded JWT payload
        const user = await User.findByPk(jwt_payload.id);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user); // Return the user if found
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passportUser;
