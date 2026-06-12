// this is model for rider's own input

import mongoose from "mongoose";

const riderInputItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const riderInputSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
      index: true,
    },
    items: [riderInputItemSchema],
    extraNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

riderInputSchema.index(
  { rider: 1, deliveryDate: 1 },
  { unique: true }
);

const RiderInput = mongoose.model("RiderInput", riderInputSchema);

export default RiderInput;