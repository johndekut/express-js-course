import {  Router } from 'express';
import { query, validationResult, matchedData, checkSchema, body } from 'express-validator';
import { mockUsers } from '../Utils/constants.mjs';
import { createUserValidationSchema } from '../Utils/validation-schemas.mjs';
import { resolveUserIndexById } from '../Utils/middlewares.mjs';
import { User } from '../mongoose/schemas/userSchema.mjs';
import { hashPassword } from '../Utils/helpers.mjs';
import {getUserByIdHandler} from '../handlers/users.mjs';
import { createUserHandler } from '../handlers/users.mjs';


const router = Router(); //router is like a mini express app that reqissters requests for a specific endpoint

router.get("/api/users",
  query('filter')
    .optional()
    .isString()
    .withMessage('must be a string')
    .notEmpty()
    .withMessage('request can not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Must be atleast 3 to 10 characters'),
  (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    const result = validationResult(request); //collects all validation errors from above checks
    console.log(result);


    //if te result of the errors is not empty, present it as an array
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const { query: { filter, value } } = request;

    //when filters and values ar undefined
    if (filter && value) return response.send(
      mockUsers.filter((user) => user[filter]).includes(value)
    );
    return response.send(mockUsers);
  });


router.get("/api/users/:id",
  resolveUserIndexById,getUserByIdHandler,
  (request, response) => {

    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    if (isNaN(parsedId)) return response.status(400).send(' Bad Request. Invalid ID');

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(400);
    return response.send(findUser);
  });


router.post('/api/users',
  checkSchema(createUserValidationSchema),
  createUserHandler,
  //the call back fn from mongo db will be asynchronous
  async (request, response) => {

    //chcck i fthere are errors in the request
    const result= validationResult(request);
    //if the error result is not empty, send it as an array
    if(!result.isEmpty()) return response.send(result.array());
    //grab validated fields using matchedData
    const data = matchedData(request);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    console.log("Hashed password:", data.password)
    //create a new instance of the user model-- takes the body content into the mongoose schema
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save()
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  });




router.put("/api/users/:id", resolveUserIndexById, (request, response) => {
  //destructuring
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});


router.patch('/api/users/:id', body('displayName')
  .isString().withMessage('user name must be a string')
  .notEmpty().withMessage('user name cant be empty'),
  resolveUserIndexById,
  (request, response) => {
    const result = validationResult(request);
    //destructuring- could be written as below
    //const request= request.body
    //const request = request.params.id
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const { body, findUserIndex } = request;

    //updating the user object 
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
  });

//delete method
router.delete('/api/users/:id', resolveUserIndexById, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});
export default router;