import {mockUsers} from '../Utils/constants.mjs'


export const getUserByIdHandler= (request, response) => {

    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    if (isNaN(parsedId)) return response.status(400).send(' Bad Request. Invalid ID');

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(400);
    return response.send(findUser);
  }