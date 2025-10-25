import {mockUsers} from '../Utils/constants.mjs';
import { getUserByIdHandler } from "../handlers/users.mjs";



const mockRequest = {
  //request in the original function sends the userindex
 params:{
  id: 1
 }};
const mockResponse =  {
  //response in the main function sends back a sttatus
  //create a mock function for that as below not the actual funtion
  sendStatus: jest.fn(),
  send:jest.fn()
};

describe('get users', () =>{
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

})