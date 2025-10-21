//This is the main/root file for the backend for express

import express, { request, response } from 'express';
import routes from './Routes/index.mjs' //file with all the routers
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './Utils/constants.mjs';
import passport from 'passport';


const app = express();

app.use(express.json());//handles middleware
app.use(cookieParser('secretkey'));
app.use(session({
  secret: 'kind of a password',
  saveUninitialized: false,//ideal for saving space...not saving new sessions
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}));

app.get('/', (request, response) => {
  response.cookie('hello', 'world', { maxAge: 300000, signed: true });
  response.send('Welcome to Adani tax dealers');
  request.session.visited = true;
  console.log(request.session);
  console.log(request.session.id);

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

app.post('/api/auth', (request, response) =>{
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
 app.get('/api/auth/status', (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) =>{
    console.log(session);
  })
  return request.session.user ? response.status(200).send(request.session.user) : response.status(401).send ({msg: 'Not authenticated'})
 })

app.post('/api/cart', (request, response) =>{
  if(!request.session.user) return response.sendStatus(401)
    const item= request.body;

  const {cart} = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});


app.get('/api/cart', (request, response) =>{
  //if there's no user defined in the session object, send that status
   if(!request.session.user) return response.sendStatus(401)
    //send the session cat but if undefined, return an empty array
    return response.send(request.session.cart ?? [])
})

app.use(routes);// activate the file with all the routers





