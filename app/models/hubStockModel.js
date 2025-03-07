const mongoose = require("mongoose");
import Hub from "./hubModel.js";
import Product from "./productModel.js";


const hubStockSchema = new mongoose.Schema(
  {
    hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HubStock", hubStockSchema);
