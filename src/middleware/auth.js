const cookieParser = require("cookie-parser");
const jwt = require ("jsonwebtoken");
const User = require ("../models/login")



const auth = async(req,res,next)=>{
    try{
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRETE_KEY);
        const user = await User.findOne({_id:verifyUser});

        req.token = token;
        req.user = user;

        next();

        
    }catch(error){
        
        res.render("login");


    }

}

module.exports = auth;