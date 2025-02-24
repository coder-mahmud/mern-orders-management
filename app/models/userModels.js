import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin','controller'],
        default:'user'
    },
    status: {
        type: String,
        default:'pending',
        enum: ['active', 'inactive', 'pending']
    },
    phone: {
        type: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    
},{timestamps:true});

userSchema.pre('save', async function(next){
  if( !this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}
const User = mongoose.model("User", userSchema);

export default User;