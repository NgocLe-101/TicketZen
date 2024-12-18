import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../components/user/user.model.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

export default function (passport) {
  // Local Login Strategy
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (user.state !== "verified") {
            return done(null, false, {
              message: "Please verify your email to login",
            });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, {
            id: user.id,
            username: user.username,
            email: user.email,
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "local-register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { username, confirm_password } = req.body;

          if (password !== confirm_password) {
            return done(null, false, {
              message: "Email or password do not match",
            });
          }

          const existingUser = await User.findOneWithUsernameOrEmail(
            username,
            email
          );
          if (existingUser) {
            return done(null, false, {
              message: "Email or username already registered",
            });
          }

          const user = await User.createUser({
            username,
            email,
            password,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.CLIENT_URL}/auth/google/callback`, // Fixed string interpolation
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            provider: "google",
            provider_id: profile.id,
          });

          if (!user) {
            user = await User.createUserByProvide({
              provider: "google",
              provider_id: profile.id,
              email: profile.emails?.[0]?.value || null,
              username: profile.displayName || "Google User",
            });
          }

          return done(null, user);
        } catch (err) {
          console.error("Error in Google Strategy:", err);
          return done(err);
        }
      }
    )
  );

  // Facebook OAuth Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.CLIENT_URL}/auth/facebook/callback`, // Fixed string interpolation
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            provider: "facebook",
            provider_id: profile.id,
          });

          if (!user) {
            user = await User.createUserByProvide({
              provider: "facebook",
              provider_id: profile.id,
              email: profile.emails?.[0]?.value || null,
              username: profile.displayName || "Facebook User",
            });
          }

          return done(null, user);
        } catch (err) {
          console.error("Error in Facebook Strategy:", err);
          return done(err);
        }
      }
    )
  );

  // Serialize User into Session
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user.id); // Store user ID in session
  });

  // Deserialize User from Session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findUserById(id); // Fetch user by ID
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
