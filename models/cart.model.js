const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },

  color: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
  }],
});

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
