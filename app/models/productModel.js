import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String,},
    price: { type: Number, required: true, default: 0 },
    category: { type: String, },
    active: { type: Boolean, default:true },
    //stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;