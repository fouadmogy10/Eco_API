const express =require("express");
const cors = require('cors');
const colors =require("colors")
const { errorHandeler, notFoundHandeler } = require("./middelware/errorHandler");
const dotenv=require("dotenv").config();
const app =express()
app.use(cors());
const connectDB =require("./config")
const userRouter=require("./routes/users")
const productRouter=require("./routes/product.routes")
const blogRouter=require("./routes/blog.routes")
const Bcat=require("./routes/Bcat.routes")
const Brand=require("./routes/Brand.routes")
const Category=require("./routes/Category.routes")
const couboun=require("./routes/coubon.routes")
const colorRouter = require("./routes/color.routes");
const enqRouter = require("./routes/enq.routes");
const uploadRouter = require("./routes/upload.routes");
const cookie=require("cookie-parser")
const morgan=require("morgan")
const PORT = 5000 || process.env.PORT
//Connect to database

connectDB();
// express middleware handling the body parsing 
app.use(express.json());

// express middleware handling the form parsing
app.use(express.urlencoded({extended: false}));
app.use(cookie())
app.use(morgan("dev"))

app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/blog",blogRouter)
app.use("/api/blogcategory",Bcat)
app.use("/api/brand",Brand)
app.use("/api/category",Category)
app.use("/api/coubon",couboun)
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);
// error handler

app.use(notFoundHandeler)
app.use(errorHandeler)

app.listen(PORT,()=>{
    console.log(`conected successfully ON PORT ${PORT}`);
})