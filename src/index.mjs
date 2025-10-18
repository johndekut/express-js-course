import express, { request, response } from 'express';
import { query, validationResult, body, matchedData, checkSchema} from 'express-validator';
import { createUserValidationSchemas , userQuerySchema } from './Utils/validation-schemas.mjs';
import router from './Routes/users.mjs';
const app = express();
app.use(express.json());//handles middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

const mockUsers = ([
  { id: 1, userName: "John", displayName: "Jonte" },
  { id: 2, userName: "James", displayName: "Makomele" },
  { id: 3, userName: "Mary", displayName: "Mrs kiazala" },
  { id: 4, userName: "Leah", displayName: "kafupi" },
  { id: 5, userName: "Mercy", displayName: "kanono" },
  { id: 6, userName: "Muthoni", displayName: "ras baby" },
  { id: 7, userName: "kim", displayName: "magenta" },
  { id: 8, userName: "Steve", displayName: "kip" }
]);

//the function below is made to reduce redundancy in getting userId in the other methods
const resolveUserIndexById = (request, response, next) => {
  const {
    params: { id }
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.status(404).send('No matching data');

  //find the user index 
  const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};



const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method}- ${request.url}`);
  next(); //ensures the second command is initiated
};

app.use(loggingMiddleware); //register the middleware globally for all routes and all http methods


app.get('/api/users',
  checkSchema(userQuerySchema),
  (request, response) => {
    const result = validationResult(request); //collects all validation errors from above checks
    console.log(result);
    
    //if te result of the errors is not empty, present it as an array
    if(!result.isEmpty()); 
      return response.status(400).send({errors:result.array()});
    const { query: { filter, value } } = request;

    //when filters and values ar undefined
    if (!filter && !value) return response.send(mockUsers);
    if (filter && value) return response.send(
      mockUsers.filter((user) => user[filter]).includes(value)
    );
    return response.send(mockUsers);
  });

app.use(loggingMiddleware, (request, response, next) => {
  console.log('finished logging...');
  next();
});

//post adds data
app.post('/api/users',
  checkSchema(createUserValidationSchemas),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if(!result.isEmpty())
      return response.status(400).send({errors:result.array()});

      const data = matchedData(request);
      //above means, give me the request data that passed validation

      console.log(data);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data};
    //...body copies the props from incoming body into newUser
    mockUsers.push(newUser);//adds the newUser at the end of mockUsers
    return response.status(201).send(newUser);
    //return ensures the handler exits immediately after sending response
  })

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) return response.status(400).send(' Bad Request. Invalid ID');

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(400);
  return response.send(findUser);
});

app.get('/api/products', (request, response) => {
  response.send([
    { id: crypto.randomUUID(), name: "colgate toothbrush", price: '$30', category: "hygiene" },
    { id: crypto.randomUUID(), name: "kali kniefe", price: '$60', category: "cutlery" },
    { id: crypto.randomUUID(), name: "plate", price: '$10', category: "utensils" }
  ]);
});


app.get(
  '/',
  (request, response, next) => {
    console.log("base url 1");
    next();
  },
  (request, response, next) => {
    console.log("base url 2");
    next();
  },
  (request, response,) => {
    response.status(201).send({ msg: 'Hello' });
  });

//PUT updates the entire body -- specify even whats not changed
app.put("/api/users/:id", resolveUserIndexById, (request, response) => {
  //destructuring
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});


app.patch('/api/users/:id', resolveUserIndexById, (request, response) => {
  //destructuring- could be written as below
  //const request= request.body
  //const request = request.params.id
  const { body, findUserIndex } = request;

  //updating the user object 
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//delete method
app.delete('/api/users/:id', resolveUserIndexById, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
})