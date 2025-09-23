const jwt = require('jsonwebtoken')

const Auth=(req,res,next)=>{
    if(req.cookies && req.cookies.userToken){
        jwt.verify(req.cookies.userToken, process.env.JWT_SECRET || "hellowelcometowebskittersacademy123456",(err,data)=>{
            req.user=data
            next()
        })
    }else{
        next()
    }
}

module.exports=Auth