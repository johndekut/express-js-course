//create a mongo db schema for the discord users similar to userSchema.mjs
import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema({
  //userName: mongoose.Schema.Types.String,
  userName: {
    type: mongoose.Schema.Types.String,
    required: true,//its mandatory
    unique: true //wont save two users doc with the same name
  },
  discordId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  }

});

export const discordUser = mongoose.model('discordUser', discordUserSchema);
