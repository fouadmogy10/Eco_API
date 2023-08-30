const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,required: true
      },
      pincode: {
        type: Number,
        required: true,
        
      },
      email: {
        type: String,
        required: true,
      },
    },
    cart: {
      type: Array,
      default: [],
    },
    paidAt:{
      type:Date,
      default:Date.now()
    },
    totalPrice:{
      type: Number,
      required: true,
    },
    orderStatus:{
      type: String,
      default: "Ordered",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
