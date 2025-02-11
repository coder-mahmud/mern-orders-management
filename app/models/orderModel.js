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
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      note: { type: String, required: true },
      location: { type: String, required: true, enum:["Inside", "Outside"] },
    },
    deliveryPoint: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required:true },
    orderSource: { type: String, enum: ["Facebook", "Website"] },
    websiteOrderId: { type: Number, },
    discount: { type: Number },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveryDate: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;