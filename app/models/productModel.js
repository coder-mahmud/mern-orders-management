import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String,},
    price: { type: Number, required: true, default: 0 },
    category: { type: String, },
    active: { type: Boolean, default:true },
    sortOrder: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;