const mongoose = require("mongoose");
const Schema = mongoose.Schema;




// define the Schema (the structure of the article)
const productSchema = new Schema({

  title: {
    type:String,
    required:true,
    trim:true
  },
  slug: {
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  description: {
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity:{
    type:Number,
  },
  sold:{
    type:Number,
    default:0
  },
  images:{
    type:Array
  },
  color:[{ type: mongoose.Schema.Types.ObjectId, ref: "Color"}],
  tags:[],
  ratings: [
    {
      star: Number,
      comment: String,
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
      
    },
  ],
  totalrating:Number
  

},{
    timestamps:true
});
module.exports=mongoose.model("product",productSchema)
