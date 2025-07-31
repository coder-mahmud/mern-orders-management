import HubStock from "../models/hubStockModel.js";
import StockHistory from "../models/stockHistoryModel.js";
import mongoose from "mongoose";




const createInitialStocks = async (req, res) => {

  try {
    const allStock = await HubStock.find();
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const historyRecords = allStock.map(stock => ({
      hubId: stock.hubId,
      productId: stock.productId,
      date: dateOnly,
      closingStock: stock.quantity,
    }));

    await StockHistory.insertMany(historyRecords);
    console.log("✅ Initial stock history created.");
    res.status(200).json({message:"success"})
  } catch (err) {
    console.error("❌ Failed to create initial history:", err);
    res.status(500).json({message:"failed"})
  }
  
  
  
}



const getServerTime = async (req, res) => {

  const now = new Date();
  console.log("🕒 Server time:", now.toString());
  
  res.status(200).json({message:"success", time: now.toString()})
  
  
}


const getStockForHub = async (req, res) => {

  const {hubId,date} = req.params;
  // console.log("Data",hubId, date)

  try {
    // Convert string to Date object and normalize to midnight
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const stock = await StockHistory.find({
      hubId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate({
      path: 'productId',
      select: 'name'
    });

    res.status(200).json({ stock });
  } catch (err) {
    console.error("❌ Error fetching stock history:", err);
    res.status(500).json({ message: "Error fetching stock history" });
  }


  
}



export {createInitialStocks, getServerTime, getStockForHub}