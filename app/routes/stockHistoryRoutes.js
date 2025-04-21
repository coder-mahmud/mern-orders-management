import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { createInitialStocks, getServerTime, getStockForHub } from '../controllers/stockHistoryController.js';
const stockHistoryRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })

stockHistoryRoutes.get("/createall", createInitialStocks)
stockHistoryRoutes.get("/time", getServerTime)
stockHistoryRoutes.get("/:hubId/:date", getStockForHub)



export default stockHistoryRoutes