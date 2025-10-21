import { request, response, Router } from 'express';
import { query, validationResult, matchedData, checkSchema, body } from 'express-validator';
import { mockUsers } from '../Utils/constants.mjs';
import { createUserValidationSchema } from '../Utils/validation-schemas.mjs';
import { resolveUserIndexById } from '../Utils/middlewares.mjs';



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
      mockUsers.filter((user) => user[filter]).includes(value())
    );
    return response.send(mockUsers);
  });


router.get("/api/users/:id",
  resolveUserIndexById,
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
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())//if there are errors
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    //above means, give me the request data that passed validation

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    //...body copies the props from incoming body into newUser
    mockUsers.push(newUser);//adds the newUser at the end of mockUsers
    return response.status(201).send(newUser);
    //return ensures the handler exits immediately after sending response
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