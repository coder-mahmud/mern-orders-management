import express from 'express'
import { getActivityLogs } from '../controllers/activityLogController.js';


const activityRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })


activityRoutes.get("/", getActivityLogs)


export default activityRoutes