// models/ActivityLog.js
import mongoose from "mongoose";
import User from "./userModels.js";
import Hub from "./hubModel.js";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
    action: {
      type: String, // e.g., "CREATE_POST", "EDIT_POST"
      required: true,
    },
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Hub",
    },
    details: {
      type: String, // extra info like post ID, old value, new value, etc.
    },
    ipAddress: {
      type: String, // optional, to track client IP
    },
    userAgent: {
      type: String, // optional, to track browser/device
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;