import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { comparePassword } from "../Utils/helpers.mjs";


passport.serializeUser((user, done) => {
	console.log('inside serializeUser function')
	done(null, user.id); //id will be used to deserialize the user as below
	console.log(user.id)
});

passport.deserializeUser(async (id, done) => {
	console.log('inside deserializeUser function')

	try {
		const findUser = await User.findById(id);
		if (!findUser) return done(null, false);
		done(null, findUser);
		console.log(findUser.id)
	} catch (err) {
		done(err, null);
	}
});

 passport.use(
 "local",
	new Strategy(
    {usernameField: "userName"},
    async (userName, password, done) => {
  
		try {
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