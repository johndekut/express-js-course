import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
  },
  password: {
    type: String,
  },
  discordId: {
    type: String,
    unique: true,
    sparse: true, // allows null values but still enforces uniqueness when present
  },
});

export const User = mongoose.model("User", userSchema);
