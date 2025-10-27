import express from "express";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import routes from "./Routes/index.mjs"


export function createApp() {
  const app= express();
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
      client: mongoose.connection.getClient()
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

  app.post('/api/cart', (request, response) => {
    if (!request.session.user) return response.sendStatus(401)
    const item = request.body;

    const { cart } = request.session;
    if (cart) {
      cart.push(item);
    } else {
      request.session.cart = [item];
    }
    return response.status(201).send(item);
  });


  app.get('/api/cart', (request, response) => {
    //if there's no user defined in the session object, send that status
    if (!request.session.user) return response.sendStatus(401)
    //send the session cat but if undefined, return an empty array
    return response.send(request.session.cart ?? [])
  });

  app.get('/api/auth/discord', passport.authenticate("discord"));
  app.get('/api/auth/discord/redirect', passport.authenticate("discord"), (request, response) => {
    console.log('session:', request.session);
    console.log(request.user)
    response.sendStatus(200);
  });

    return app;
}

