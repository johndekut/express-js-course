
import { response, Router } from "express";
import passport from 'passport';
import { mockUsers } from "../Utils/constants.mjs";

const router = Router();

/*
router.post('/api/auth', (request, response) =>{
  const {
    //destructure to grab username and password
    body: {userName, password}
  } = request;
  console.log('BODY:', request.body);
  const findUser = mockUsers.find((user) => user.userName === userName);
  if (!findUser || findUser.password !== password)
    return response.status(401).send('BAD CREDENTIALS');
  //below stores the user object in the session
  request.session.user = findUser;
  return response.status(200).send(findUser);
});
*/
/*
 router.get('/api/auth/status', (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) =>{
    console.log(session);
  })
  return request.session.user ? response.status(200).send(request.session.user) : response.status(401).send ({msg: 'Not authenticated'})
 })
  */




//check if the user is authenicated or not
router.get('/api/auth/status',
  (request, response) => {
    console.log(`INSIDE /AUTH/STATUS ENDPOINT`);
    console.log(request.user);
    console.log(request.session);
    //if request.user is truthy, send back the users otherwise send the status code 401 --ternary operator
    return request.user ? response.send(request.user) : response.sendStatus(401)
  }
);

router.post('/api/auth',
  passport.authenticate('local'), (request, response) => {
    response.status(200).send(request.user);
  });

router.post('/api/auth/logout', (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});



export default router;