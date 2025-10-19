import express, { request, response } from 'express';
import routes from './Routes/index.mjs'


const app = express();
app.use(express.json());//handles middleware
app.use(routes);


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
