//This is the main/root file for the backend for express
import dotenv from 'dotenv';
dotenv.config();
import express, { request, response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

//import "./strategies/local-strategies.mjs"
import routes from './Routes/index.mjs' //file with all the routers
import './strategies/discord-strategy.mjs'




const app = express()

mongoose.connect('mongodb://localhost/express-tutorial')
//above returns a promise, use .then
.then(()=>{
  console.log("connected to database")
}).catch((err) => console.log(`Error: $err`));

app.use(express.json());//handles middleware
app.use(cookieParser('secretkey'));
app.use(session({
  secret: 'kind of a password',
  saveUninitialized: false,//ideal for saving space...not saving new sessions
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  },
  //set session store
  store: MongoStore.create({
  client:mongoose.connection.getClient()
  })
}));

app.use(passport.initialize());
app.use(passport.session())
app.use(routes);// activate the file with all the routers


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
});

app.get('/api/auth/discord', passport.authenticate("discord"));
app.get('/api/auth/discord/redirect', passport.authenticate("discord"), (request, response) =>{
  console.log('session:',request.session);
  console.log(request.user)
  response.sendStatus(200);
});



