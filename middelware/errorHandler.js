const errorHandeler=(err,req,res,next)=>{
    const statusCode=res.statusCode == 200 ?res.statusCode:500
    res.status(statusCode)
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==='production'?null: err.stack
    })
}
const notFoundHandeler=(req,res,next)=>{
    const error =new Error(`not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
    
}
module.exports={
    errorHandeler,notFoundHandeler
}