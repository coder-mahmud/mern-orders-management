import User from "../models/userModels.js";
import mongoose from "mongoose";
import generateToken from "../utils/generateToken.js";
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import nodemailer from 'nodemailer';



const FRONTEND_URL = process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : ''

const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;

const createUser = async (req,res) => {
  const {username, email, password,firstName, lastName,phone, image} = req.body;
  try {
    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if(userExist){
      res.status(400)
      throw new Error("User already exists! Try different username or email.")
    }
    

    const newUser = await User.create({firstName, lastName, username,email,phone,password,image})
    
    if(newUser){
      newUser.password = undefined;
      res.status(201).json({
        message:"User created!",
        user:{
          username:newUser.username,
          email:newUser.email
        }
      })
    }else{
      res.status(400)
      throw new Error("Invalid user data!")
    }
  } catch (error) {
    console.log(error.message)
    res.status(401).json({message:error.message})
  }
}


const userLogin = async (req,res) => {
  console.log("Login route hit!")
  const { password, username} = req.body
  console.log("login data",username, password)

  try {
    const user = await User.findOne({username});
    if(user && await user.matchPassword(password)){
      generateToken(res, user._id)
      res.status(200).json({
        username:user.username,
        email: user.email,
        role:user.role,
      })
      // res.status(200).json({
      //   ...user.toObject(), // Convert user to a plain object
      //   password: undefined,
      // })
    }else{
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    res.status(401).json({"message":error.message})
  }
  
}

const userLogOut = async (req,res) => {
  res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0)
  })

  res.status(200).json({message:"User Logged out"})
}


const userProfile = async (req,res) => {
  res.status(200).json({message:"user profile route"})
}
const verifyUser = async (req,res) => {
  res.status(200).json({message:"user profile verified"})
}

const userEdit = async (req,res) => {

  console.log("Edit user hitted!")
  const {user:jwtuser} = req
  //console.log("auth user", jwtuser)
  const {name, email, username,password,newPassword, image, role,status, phone } = req.body
  console.log("Body", req.body);

  
  try {
    const user = await User.findOne({email:jwtuser.email})
    if(user){
      if(user.status == 'pending'){
        throw new Error("Your account is not approved yet! Contact an Admin.")
      }

      //console.log("User",user)

      user.phone = phone || user.phone ;
      user.image = image || user.image ;


      if(password){
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          throw new Error("Old password is incorrect!");
        }
        user.password = newPassword;
      }
      
      const updatedUser = await user.save();
      updatedUser.password = undefined; 
      res.status(200).json({
        user:{name:updatedUser.name, username:updatedUser.username, email:updatedUser.email, role:updatedUser.role, status:updatedUser.status}
      })


    }else{
      throw new Error("Something went wrong!")
    }
  } catch (error) {
    res.status(401).json({message:error.message})
  }
  
}


const resetPasswordRequest = async (req,res) => {
  // console.log("FRONTEND_URL",FRONTEND_URL)
  const { email } = req.body;
  console.log("email", email)

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    console.log("user: ", user)
    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiration in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log("user saved")

    // Send email

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: email_user,
        pass: email_pass ,
      }
    });

    // Configure the mailoptions object
    const resetUrl = `${FRONTEND_URL}?resetpass=${resetToken}`;
    const mailOptions = {
      from: 'mahmud.linked@gmail.com',
      // from: email_user,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click here to reset your password: ${resetUrl}`
    };
    
  

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.log("Error", error)
    res.status(500).json({ message: 'Error resetting password.', error });
  }



}

const resetPassword = async (req,res) => {

  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("Token", token)

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    // Hash new password and save it
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(newPassword, salt);

    user.password = newPassword
    // Clear reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password.', error });
  }


}


export {createUser,userLogin,userLogOut, userProfile, userEdit, verifyUser, resetPasswordRequest, resetPassword}