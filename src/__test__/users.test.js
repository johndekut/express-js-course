import validator from 'express-validator';
import {mockUsers} from '../Utils/constants.mjs';
import { getUserByIdHandler, createUserHandler} from "../handlers/users.mjs";

//mocking validation result
jest.mock("express-validator", () =>({
  validationResult:jest.fn(() =>({
    isEmpty:jest.fn(() => false), //(!isEmpty)
    array: jest.fn(() => [{msg: "invalid field"}])
  })),
}));

const mockRequest = {
  //request in the original function sends the user id
 params:{
  id: 1
 }};
const mockResponse =  {
  //response in the main function sends back a sttatus
  //create a mock function for that as below not the actual funtion
  sendStatus: jest.fn(),
  send:jest.fn(),
  status: jest.fn(() =>{mockResponse})
};

describe('get users', () =>{
  beforeEach(() =>{
    jest.clearAllMocks();
  })
  it ('should get user by id',() =>{
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[0]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it('should call sendStatus of 404 when user is not found', () =>{
    const copyMockRequest = {...mockRequest,params:{id:100} }
    getUserByIdHandler(copyMockRequest, mockResponse);
    //below are called assertions
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

});
//anything initialized with describe is called a test suite
describe('create new user', () =>{
  const mockRequest = {};
  it('Should return a status of 400 if errors are present', async () =>{
    await createUserHandler(mockRequest, mockResponse)
     //assertion for validation result
  expect(validator.validationResult).toHaveBeenCalledTimes(1);
  });
 
})