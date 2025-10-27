import request from "supertest";
import express, { response } from 'express';

const app = express();//set an express app

app.get('/hello', (req, res) => {
  res.status(200).send({});
});

describe('hello endpoint', () => {
  it('get /hello and expect 200 status code', async () => {
    const response = await request(app).get('/hello');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });
});