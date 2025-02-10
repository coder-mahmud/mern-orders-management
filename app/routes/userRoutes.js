import express from 'express'
import { createUser,userLogin,userLogOut, userProfile, userEdit, verifyUser } from '../controllers/userController.js'
import protect from '../middlewares/authMiddleware.js'

const userRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })

userRoutes.post("/", createUser)
userRoutes.post("/login", userLogin)
userRoutes.post("/logout", userLogOut)
userRoutes.get("/profile",protect, userProfile)
userRoutes.post("/edit",protect, userEdit)
userRoutes.post("/verify",protect, verifyUser)

export default userRoutes