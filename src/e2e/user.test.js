import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";


//This file is a workflow test - tests the actual user journey   from creating account, logging in, and accessing authenticated routes
describe('create user and login', () => {
  //declare an instance to hold my app variable
  let app;
  //connect to a db before anything
  beforeAll(() => {
    mongoose
      .connect('mongodb://localhost/express_tutorial_test')
      .then(() => console.log('connected to test database'))
      .catch((err) => console.log(`Error: ${err}`));
    app = createApp();
  })
  it('should create the user', async () => {
    const response = await request(app).post('/api/users').send({
      userName: "kamotho",
      displayName: "kamoso",
      password: "hello456"
    });
    expect(response.statusCode).toBe(201);
  });

  it('should log the user in and visit /api/auth/status and return auth user', async () => {
    const response = await (request(app)
      .post('/api/auth'))
      .send({
        userName: "kamotho",
        password: "hello456"
      })
      //below is chained because it does not have access to the cookie
      .then((res) => request(app)
        .get('/api/auth/status')
        .set('cookie', res.headers["set-cookie"]));
    expect(response.statusCode).toBe(200);
    expect(response.body.userName).toBe('kamotho');
    expect(response.body).not.toBe({})
  });

  afterAll(async () => {
    //check connectionstate before closing the db
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close()
    }
  })
});
