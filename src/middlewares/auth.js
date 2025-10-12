const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth= async (req,res,next)=>{
    
    
    try{
    // Read the token from the req cookies

    const {token} = req.cookies;
    if(!token){
        throw new Error("Invalid Token");
    }
    // Validate the token
    const decodedObj = await jwt.verify(token,"deepak@12");
    
    const _id = decodedObj;
    // Find User
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found")
    }

    req.user = user;
    next();
}catch(err){
    res.status(401).send("Error:" + err.message);
}
        
    
}
module.exports ={
    userAuth
}