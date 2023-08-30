const mongoose =require("mongoose")

const connectDB =async()=>{

     try{
        const conn =await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongodb Connected :${conn.connection.host} `.cyan.underline);
     } 
     catch{
        err=>{
            console.log(`Erorr:  ${err}`.red.underline.bold);
            process.exit(1)
        }

     }
}
module.exports=connectDB