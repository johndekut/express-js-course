//This is the main/root file for the backend for express
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import "./strategies/local-strategies.mjs"
import { createApp } from './createApp.mjs';

//connnect to the db then initialize the app - order matters
try{
mongoose
.connect('mongodb://localhost/express-tutorial')
//above returns a promise, use .then
.then(()=> console.log("connected to database"));
const app = createApp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
})
} catch(err) {
console.log(`Error: $err`);
}
//.catch((err) => console.log(`Error: $err`));




