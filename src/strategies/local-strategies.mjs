import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../Utils/constants.mjs";

//below isonly called once
passport.serializeUser((user, done) =>{
  //only store the user id, not everything belonging to the user
  console.log(`inside serialize user`);
  console.log(user)
  done(null, user.id)
});
//deserealize is used to unpack the user object using the key
//userName/id --unique is what we use to get other data regarding the user
passport.deserializeUser((id, done) =>{
  console.log(`inside deserialze`);
  console.log(`Deserializing user Id: ${id}`)
try{
const findUser = mockUsers.find((user) => user.id === id);
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
    
    (userName, password, done) => {
    console.log(`user name: ${userName}`);
    console.log(`Password: ${password}`);


    try {
      //below is a code that might fail
      const findUser = mockUsers.find((user) => user.userName === userName);
      if (!findUser) throw new Error('user not found')
      if (findUser.password !== password)
        throw new Error("Invalid credentials")
      //if everything here succeeds, below fn is called
      done(null, findUser)
    } catch (err) {
      //err- hold info on what went wrong
      done(err, null);
    }
  })
)