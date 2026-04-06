import express from 'express'

import { getRiderStocks, 
  getRiderStockById,
  createOrUpdateRiderStock,
  editRiderStock,
  deleteRiderStock,
  getRiderStockByDate,
  getRiderRemainingStock,
  getRiderDeliverySummary, } from '../controllers/riderStockController.js';

  

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
riderStockReportRoutes.get("/remaining/:riderId/:date", getRiderRemainingStock);
riderStockReportRoutes.get("/summary/:riderId/:date", getRiderDeliverySummary);
riderStockReportRoutes.get("/:id", getRiderStockById);
riderStockReportRoutes.get("/", getRiderStocks);


export default riderStockReportRoutes;