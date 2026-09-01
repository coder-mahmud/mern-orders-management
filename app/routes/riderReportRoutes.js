import express from 'express'
import { getRiderReports, createRiderReport, getRiderReportsByDate } from '../controllers/riderReportController.js';
import protect from '../middlewares/authMiddleware.js';


const riderReportRoutes = express();

riderReportRoutes.get("/",protect, getRiderReports);
riderReportRoutes.post("/create",protect, createRiderReport);
riderReportRoutes.get("/getbydate/:date",protect, getRiderReportsByDate);

/*
orderRoutes.post("/create", createOrder);
orderRoutes.post("/edit", editOrder);
orderRoutes.post("/delete", deleteOrder);
orderRoutes.post("/status", changeOrderStatus);
orderRoutes.post("/verify", changeVerifyStatus);
orderRoutes.get("/hub/:id/:date", getHubOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.get("/date/:date", getOrderByDate);
*/
export default riderReportRoutes;