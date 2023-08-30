const  mongoose  = require("mongoose");


function validateMongoDbId(id) {
    const isValid =mongoose.Types.ObjectId.isValid(id); 
    if (!isValid)  throw new Error("this is id not a valid or not found")
    
}
module.exports=validateMongoDbId

