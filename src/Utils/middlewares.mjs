 import { mockUsers } from "./constants.mjs";
 
 //the function below is made to reduce redundancy in getting userId in the other methods

export const resolveUserIndexById = (request, response, next) => {
  //const id=request.params.id; -destructured as below
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