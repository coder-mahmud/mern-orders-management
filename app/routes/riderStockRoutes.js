import express from 'express'
import protect from '../middlewares/authMiddleware.js';

import { getRiderStocks, 
  getRiderStockById,
  createOrUpdateRiderStock,
  editRiderStock,
  deleteRiderStock,
  getRiderStockByDate,
  getRiderRemainingStock,
  getRiderDeliverySummary,
  getAllRidersSummaryByDate,
  getComparedRiderOrders, 
} from '../controllers/riderStockController.js';

  

  // import { getRiderStocks } from '../controllers/riderStockController.js';

const riderStockReportRoutes = express();

/*
riderStockReportRoutes.get('/',(req,res)=>{
  res.json({"message":"Rider stock report route!"})
})
*/


riderStockReportRoutes.post("/",protect, createOrUpdateRiderStock);
riderStockReportRoutes.put("/",protect, editRiderStock);
riderStockReportRoutes.delete("/",protect, deleteRiderStock);

riderStockReportRoutes.get("/date/:riderId/:date",protect, getRiderStockByDate);
riderStockReportRoutes.get("/remaining/:riderId/:date", protect, getRiderRemainingStock);
riderStockReportRoutes.get("/summary/:riderId/:date",protect, getRiderDeliverySummary);
riderStockReportRoutes.get("/:id",protect, getRiderStockById);
riderStockReportRoutes.get("/",protect, getRiderStocks);
riderStockReportRoutes.get('/all-riders-summary/:date',protect, getAllRidersSummaryByDate);
riderStockReportRoutes.get("/compare/:riderId/:date", protect, getComparedRiderOrders);


export default riderStockReportRoutes;