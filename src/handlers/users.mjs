//contains the functions to be tested
import { validationResult, matchedData } from 'express-validator';
import { hashPassword } from '../Utils/helpers.mjs';
import {mockUsers} from '../Utils/constants.mjs';



export const getUserByIdHandler= (request, response) => {

    const parsedId = parseInt(request.params.id);
    if (isNaN(parsedId)) return response.status(400).send(' Bad Request. Invalid ID');

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(400);
    return response.send(findUser);
  }
  //creating a handler for creating users
  export const createUserHandler =  async (request, response) => {
      //chcck i fthere are errors in the request
      const result= validationResult(request);
      //if the error result is not empty, send it as an array
      if(!result.isEmpty()) return response.send(result.array());
      //grab validated fields using matchedData
      const data = matchedData(request);
      
      data.password = hashPassword(data.password);
      //create a new instance of the user model-- takes the body content into the mongoose schema
      const newUser = new User(data);
      try {
        const savedUser = await newUser.save()
        return response.status(201).send(savedUser);
      } catch (err) {
        return response.sendStatus(400);
      }
    }