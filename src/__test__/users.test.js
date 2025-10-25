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
  })

})