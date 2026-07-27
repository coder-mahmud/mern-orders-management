import express from 'express'
import protect from '../middlewares/authMiddleware.js';

import { getRiderStocks, 
  getRiderStockById,
  createOrUpdateRiderStock,
  editRiderStock,
  deleteRiderStock,
  getRiderStockByDate,
  getRiderRemainingStock,
  getRiderDeliverySummary, getAllRidersSummaryByDate } from '../controllers/riderStockController.js';

  

  // import { getRiderStocks } from '../controllers/riderStockController.js';

const riderStockReportRoutes = express();

/*
riderStockReportRoutes.get('/',(req,res)=>{
  res.json({"message":"Rider stock report route!"})
})
*/


riderStockReportRoutes.post("/", createOrUpdateRiderStock);
riderStockReportRoutes.put("/", editRiderStock);
riderStockReportRoutes.delete("/", deleteRiderStock);

riderStockReportRoutes.get("/date/:riderId/:date", getRiderStockByDate);
riderStockReportRoutes.get("/remaining/:riderId/:date", protect, getRiderRemainingStock);
riderStockReportRoutes.get("/summary/:riderId/:date",protect, getRiderDeliverySummary);
riderStockReportRoutes.get("/:id", getRiderStockById);
riderStockReportRoutes.get("/", getRiderStocks);
riderStockReportRoutes.get('/all-riders-summary/:date', getAllRidersSummaryByDate);


export default riderStockReportRoutes;