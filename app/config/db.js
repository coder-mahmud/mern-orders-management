import mongoose from "mongoose";
const connect = async () => {
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully!")
  } catch (error) {
    console.log(error.message)
  }
}

export default connect;