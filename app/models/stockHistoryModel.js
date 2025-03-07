const mongoose = require("mongoose");


const hubHistorySchema = new mongoose.Schema(
  {
    hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    date: { type: Date, required: true },
    closingStock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HubHistory", hubHistorySchema);
