import mongoose from "mongoose";


const hubHistorySchema = new mongoose.Schema(
  {
    hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    date: { type: Date, required: true },
    closingStock: { type: Number, required: true, }
  },
  { timestamps: true }
);

const StockHistory = mongoose.model("HubStockHistory", hubHistorySchema);
export default StockHistory;