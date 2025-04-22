import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_, __, profile, done) => {
      const email = profile.emails?.[0]?.value;
      const existing = await User.findOne({ email });
      if (existing) return done(null, existing);

      const newUser = await User.create({
        username: profile.id,
        fullName: profile.displayName,
        email,
        password: profile.id, // Randomly for now
        role: "user",
      });
      done(null, newUser);
    }
  )
);
