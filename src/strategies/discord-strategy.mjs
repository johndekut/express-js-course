import dotenv from "dotenv";
dotenv.config(); // ensure env variables load


import passport from "passport";
//import strategy class for discord/fb/github...
import Strategy from "passport-discord";

//configuration for the strategy option
export default passport.use(
  new Strategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']//to get the basic stuff of the user eh username, id
  }, (accessToken, refreshToken, profile, done) => { 
    //accessToken - temp key that lets my app act on behalf of the user
    //refreshToken - get new tokens when old ones expire
    //profile- contains users info from the provider
    console.log(profile)
  })
);