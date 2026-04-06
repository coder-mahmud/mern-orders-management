import jwt from 'jsonwebtoken'
import User from '../models/userModels.js';
import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv';
dotenv.config();
/*
const protect = asyncHandler( async (req,res,next) => {
  let token;
  token = req?.cookies?.jwt;
  // console.log("Token", token)
  if(token){
    try{
      // console.log("Token found from middleware!")
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password');
      next();

    }catch(err){
      res.status(401).json({message:"Invalid Token!"})
      //throw new Error("Invalid Token!")
    }
  }else{
    res.status(401).json({message:"No Token, User not authorized to see this resource!!", token})    
  }
})
  */

const protect = asyncHandler(async (req, res, next) => {
  let token = req?.cookies?.jwt;
  console.log("Token", token)

  if (!token) {
    return res.status(401).json({
      message: "No Token, User not authorized to see this resource!!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded from middleware:", decoded)

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }


    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token!" });
  }
});

export default protect;