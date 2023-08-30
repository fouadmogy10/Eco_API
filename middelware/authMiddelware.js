const express =require("express");
const jwt =require("jsonwebtoken")
const AsyncHandler=require("express-async-handler")
const User=require("../models/users.model")


const verifyToken =AsyncHandler(async(req,res,next)=>{
    let  authToken=req.headers.authorization;
    if (authToken) {
        token=authToken.split(" ")[1]
        
        try {
            const decoded =jwt.verify(token,process.env.JWT_SECRET)
            req.user =decoded;
            next()
        } catch (error) {
            res.status(401).json({
                message:"invalid token , access denied"
            })
            
        }
    } else {
        return res.status(401).json({
            message:"no token provieded , access denied"
        })
    }

})

const protect =AsyncHandler(async(req,res,next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token=req.header('Authorization').split(" ")[1]
            const decoded =jwt.verify(token,process.env.JWT_SECRET)
            req.user =await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            
            throw new Error(` سجل دخول ينجم`)
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('سجل دخول ينجم')
    }
})

const verifyTokenAndAdmin =AsyncHandler(async(req,res,next)=>{
    await verifyToken(req,res,() => {
        if (req.user.role == "admin") {
            next();
        }else{
            return res.status(403).json({
                message: "not allow only admin can access"
            })
        }
    })

})
module.exports={
    protect,verifyTokenAndAdmin,verifyToken
}