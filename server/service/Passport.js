const { Passport } = require("passport");
const passportUser = new Passport();
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { User } = require("../indexdatabase");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

// Local Strategy for login (Authentication)
passportUser.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
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

        return done(null, user);
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
//  Google OAuth Strategy
passportUser.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/login",
      passReqToCallback: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        // if (!user) {
        //   // If the user does not exist, create a new one
        //   user = await User.create({
        //     googleId: profile.id,
        //     firstName: profile.name.givenName,
        //     lastName: profile.name.familyName,
        //     email: profile.emails[0].value,
        //     image: profile.photos[0].value,
        //     scope: ["openid", "profile", "email"],
        //     password: null, // No password needed for Google users
        //   });
        // }
        if (!user) {
          // If the user does not exist, create a new one
          user = await User.create({
            googleId: profile.id,
            firstName: profile.name?.givenName || "Unknown",
            lastName: profile.name?.familyName || "User",
            email: profile.emails?.[0]?.value || null,
            image: profile.photos?.[0]?.value || null,
            password: null, // Google users do not have passwords
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passportUser;
