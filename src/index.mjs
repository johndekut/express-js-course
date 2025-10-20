//This is the main/root file for the backend for express

import express, { request, response } from 'express';
import routes from './Routes/index.mjs' //file with all the routers
import cookieParser from 'cookie-parser';
import session from 'express-session';


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

app.use(routes);// activate the file with all the routers

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});








