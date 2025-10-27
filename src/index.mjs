//This is the main/root file for the backend for express
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import "./strategies/local-strategies.mjs"
import { createApp } from './createApp.mjs';

//connnect to the db then initialize the app - order matters
mongoose
  .connect('mongodb://localhost/express-tutorial')
  .then(() => console.log('connected to database'))
  .catch((err) => console.log(`Error: ${err}`));

  const app = createApp();




