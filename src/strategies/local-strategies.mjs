import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../Utils/constants.mjs";
import { user } from "../mongoose/schemas/userSchema.mjs";

//below isonly called once
passport.serializeUser((user, done) =>{
 
  console.log(`inside serialize user`);
  console.log(user)
   //only store the user id, not everything belonging to the user
  done(null, user.id)
});
//deserealize is used to unpack the user object using the key
//userName/id --unique is what we use to get other data regarding the user
passport.deserializeUser(async (id, done) =>{
  console.log(`inside deserialze`);
  console.log(`Deserializing user Id: ${id}`)
try{
const findUser = await user.findById(id)
if(!findUser) throw new Error("User not found")
  //if user is found, return the user, set error to null
done(null, findUser);
}catch(err) { 
  //if there is any error, catch it and set the user to null
  done(err, null);
}
})
export default passport.use(
  new Strategy( 
    {
      usernameField:"userName",
      passwordField:"password",
    },
    
    async (userName, password, done) => {
    try {
      const findUser= await user.findOne({userName})
     if (!findUser) throw new Error("User not Found");
     if (findUser.password !== password) throw new Error("Bad credentials");
     done(null, findUser)
    } catch (err) {
      //err- hold info on what went wrong
      done(err, null);
    }
  })
)