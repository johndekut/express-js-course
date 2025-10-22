import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
  //userName: mongoose.Schema.Types.String,
  userName: {
    type: mongoose.Schema.Types.String,
    required: true ,//its mandatory
    unique: true //wont save two users doc with the same name
  },
  //displayName:mongoose.Schema.Types.String,
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  //password: mongoose.Schema.Types.String
  password:{
    type: mongoose.Schema.Types.String,
    required: true
  }
});

export const user= mongoose.model('user', userSchema);
