//This is the main/root file for the backend for express

import express, { request, response } from 'express';
import routes from './Routes/index.mjs' //file with all the routers


const app = express();
app.use(express.json());//handles middleware
app.use(routes);// activate the file with all the routers


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});


const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method}- ${request.url}`);
  next(); //ensures the second command is initiated
};

app.use(loggingMiddleware); //register the middleware globally for all routes and all http methods

app.use((request, response, next) => {
  console.log('finished logging...');
  next();
});





//PUT updates the entire body -- specify even whats not changed
