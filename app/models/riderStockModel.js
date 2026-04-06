import mongoose from "mongoose";
import User from "./userModels.js";

const riderStockSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        assignedQty: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// one stock entry per rider per day
riderStockSchema.index({ rider: 1, date: 1 }, { unique: true });

const RiderStock = mongoose.model("RiderStock", riderStockSchema);
export default RiderStock;