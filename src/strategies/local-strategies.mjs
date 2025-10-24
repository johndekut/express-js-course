import passport from "passport";
import { Strategy } from "passport-local";
//import { User } from "../mongoose/schemas/userSchema.mjs";
import { comparePassword } from "../Utils/helpers.mjs";




 passport.use(
 "local",
	new Strategy(
    {usernameField: "userName"},
    async (userName, password, done) => {
  
		try {
      console.log(password);
      //find user using the userName
			const findUser = await User.findOne({ userName });
      console.log("Query result:", findUser);
			if (!findUser) throw new Error("User not found");
			if (!comparePassword(password, findUser.password))
				throw new Error("Bad Credentials");
			done(null, findUser);
		} catch (err) {
			done(err, null);
		}
	})
);
console.log("LOADED LOCAL STRATEGIES");

export default passport;