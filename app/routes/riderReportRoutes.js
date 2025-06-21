import express from 'express'
import { getRiderReports, createRiderReport, getRiderReportsByDate } from '../controllers/riderReportController.js';


const riderReportRoutes = express();

riderReportRoutes.get("/", getRiderReports);
riderReportRoutes.post("/create", createRiderReport);
riderReportRoutes.get("/getbydate/:date", getRiderReportsByDate);

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