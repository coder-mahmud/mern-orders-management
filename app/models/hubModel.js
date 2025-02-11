import mongoose from "mongoose";
import Product from "./productModel.js";

const hubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },

    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        stock: { type: Number, default: 0 }
    }],
    
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Hub = mongoose.model("Hub", hubSchema);
export default Hub;