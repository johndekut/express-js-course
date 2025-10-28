import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";



//this file is a simulation it starts my express app, connects it to  test database and run realistic http request using supertest

describe('/api/auth', () => {
  //declare an instance to hold my app variable
let app;
  //connect to a db before anything
  beforeAll(() => {
    mongoose
      .connect('mongodb://localhost/express_tutorial_test')
      .then(() => console.log('connected to test database'))
      .catch((err) => console.log(`Error: ${err}`));
       app = createApp(); //call createApp to initialize all middlewares
  })
  it('should return 401 when not logged in', async () => {
    const response = await request(app).get('/api/auth/status');
    expect(response.statusCode).toBe(401);
  })
  afterAll( async () =>{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close()
  })
});
