import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { User } from "../mongoose/schemas/userSchema.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) return done(null, false);
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  "discord",
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify", "email"]
      //scope is what we want the OAuth2 provider to give us about the user
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Look for existing user
        let findUser = await User.findOne({ discordId: profile.id });

        if (!findUser) {
          // Create new user if none exists
          const newUser = new User({
            userName: profile.username,
            displayName: profile.global_name || profile.username,
            discordId: profile.id,
            password: null // optional since OAuth users won't have one
          });

          findUser = await newUser.save();
          console.log(" New Discord user created:", findUser);
        }

        return done(null, findUser);
      } catch (err) {
        console.error(" Error in Discord strategy:", err);
        return done(err, null);
      }
    }
  )
);

console.log("LOADED DISCORD STRATEGY");
export default passport;
