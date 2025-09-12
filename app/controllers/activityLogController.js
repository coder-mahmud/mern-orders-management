import ActivityLog from "../models/activityLogModel.js";
import mongoose from "mongoose";
import { logActivity } from "../utils/logActivity.js";
import User from "../models/userModels.js";


const getActivityLogs = async (req, res) => {
  const activities = await ActivityLog.find() .populate("user", "username").populate("hub", "name").sort({ createdAt: -1 }).limit(10) ;
  res.status(200).json({message:"Get all Activity route", logs:activities})
}




export { getActivityLogs }