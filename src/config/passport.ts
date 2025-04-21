import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/Users";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails?.[0].value,
        });

        if (existingUser) return done(null, existingUser);

        // Create user if not exists
        const newUser = new User({
          username: profile.id,
          fullName: profile.displayName,
          email: profile.emails?.[0].value,
          role: "user", // default
          authProvider: "google",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);
