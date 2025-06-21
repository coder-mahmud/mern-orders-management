import express from 'express'
import { getInternalReports, createInternalReport, getInternalReportsByDate } from '../controllers/internalReportController.js';



const internalReportRoutes = express();

internalReportRoutes.get("/", getInternalReports);
internalReportRoutes.post("/create", createInternalReport);
internalReportRoutes.get("/getbydate/:date", getInternalReportsByDate);


/*
internalReportRoutes.get("/", getRiderReports);
internalReportRoutes.post("/create", createRiderReport);
internalReportRoutes.get("/getbydate/:date", getRiderReportsByDate);
*/
export default internalReportRoutes;