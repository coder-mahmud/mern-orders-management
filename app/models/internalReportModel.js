import mongoose from "mongoose";
import User from "./userModels.js";
import Product from "./productModel.js";
import Hub from "./hubModel.js";

const internalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required:true },
    deliveryDate: { type: Date },
    onlineDelivery: { type: Number },
    offlineDelivery: { type: Number },
    orderCount: { type: Number },
    reportType: { type: String },
    rider: { type: String },
  },
  { timestamps: true }
);

const InternalReport = mongoose.model("InternalReport", internalReportSchema);
export default InternalReport;