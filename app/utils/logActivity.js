// utils/logActivity.js
import ActivityLog from "../models/activityLogModel.js";

export const logActivity = async (userId, action, hub, details = "", req = null) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      hub,
      details,
      ipAddress: req?.ip || "",
      userAgent: req?.headers["user-agent"] || "",
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};
