import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { comparePassword } from "../Utils/helpers.mjs";

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User Not Found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
 
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