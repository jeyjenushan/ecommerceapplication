const jwt=require("jsonwebtoken")
const User=require("../models/User")


//Middleware to protect routes
const protectRoute=async(req,res,next)=>{
    let token;

    try{
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        req.user=await User.findById(decode.user.id).select("-password");
        next()
}
else{
    res.status(402).json({message:"Not authorized not token provided"})
}

    }catch(error){
        console.log("Token verification failed",error)
        res.status(401).send('Internal Server Error');
    }

}

//Middleware to check if the user is an admin
const adminRoute=(req,res,next)=>{
    if(req.user && req.user.role=="admin"){
        next()
    }else{
        res.status(403).json({message:"Not authorized as an admin"})
    }
}

module.exports={
    protectRoute,adminRoute
}