import cron from "node-cron";
import HubStock from "../models/hubStockModel.js";
import StockHistory from "../models/stockHistoryModel.js";

// Run every day at 11:59 PM
cron.schedule("00 11 * * *", async () => {
  console.log("⏰ Running daily stock snapshot...");

  try {
    const allStock = await HubStock.find();

    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const historyRecords = [];

    // temporary commenting for daily stock

    /*
    for (const stock of allStock) {
      // Optional: check to prevent duplicates
      const exists = await StockHistory.findOne({
        hubId: stock.hubId,
        productId: stock.productId,
        date: dateOnly,
      });

      if (!exists) {
        historyRecords.push({
          hubId: stock.hubId,
          productId: stock.productId,
          date: dateOnly,
          closingStock: stock.quantity,
        });
      }
    }
      */

    if (historyRecords.length > 0) {
      //await StockHistory.insertMany(historyRecords);
      console.log(`✅ ${historyRecords.length} stock history records created.`);
    } else {
      console.log("📭 No new records to insert today.");
    }

  } catch (err) {
    console.error("❌ Error recording stock history:", err);
  }
});
