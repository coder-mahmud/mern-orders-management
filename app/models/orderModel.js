import mongoose from "mongoose";
import User from "./userModels.js";
import Product from "./productModel.js";
import Hub from "./hubModel.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    // shippingAddress: {
    //   fullName: { type: String, required: true },
    //   address: { type: String, required: true },
    //   phone: { type: String, required: true },
    //   note: { type: String, required: true },
    //   hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required:true },
    // },
    hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required:true },

    customerDetails: { type: String, required:true },
    orderType: { type: String, enum: ["Offline", "PandGo"] },
    orderSource: { type: String, enum: ["Facebook", "Website"] },
    orderStatus: { type: String, enum: ["Pending", "Delivered", "Cancelled","Offline Delivery"], default: "Pending"  },
    websiteOrderId: { type: Number, },
    discount: { type: Number },
    orderPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveryDate: { type: Date },
    deliveredAt: { type: Date },
    orderType:{ type: String, enum: ["Pending","New"], default: "New"  },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;