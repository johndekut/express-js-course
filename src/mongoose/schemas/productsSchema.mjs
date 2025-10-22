import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.String,
    required: false
  }

});

export const product= mongoose.model('product', productsSchema)