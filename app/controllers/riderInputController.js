import asyncHandler from "express-async-handler";
import RiderInput from "../models/riderInputModel.js";
import Product from "../models/productModel.js";

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Create or update rider's own product delivery input
// @route   POST /api/rider-inputs
// @access  Private/Rider
export const createOrUpdateRiderInput = asyncHandler(async (req, res) => {
  const { deliveryDate, items } = req.body;

  if (!deliveryDate) {
    res.status(400);
    throw new Error("Delivery date is required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("At least one product quantity is required");
  }

  const rider = req.user._id;
  const dateOnly = normalizeDate(deliveryDate);

  const cleanedItems = items
    .filter((item) => Number(item.quantity) > 0)
    .map((item) => ({
      product: item.product,
      name: item.name,
      quantity: Number(item.quantity),
    }));

  if (cleanedItems.length === 0) {
    res.status(400);
    throw new Error("Please enter quantity for at least one product");
  }

  const productIds = cleanedItems.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
    active: true,
  });

  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error("One or more products are invalid or inactive");
  }

  const riderInput = await RiderInput.findOneAndUpdate(
    {
      rider,
      deliveryDate: dateOnly,
    },
    {
      rider,
      deliveryDate: dateOnly,
      items: cleanedItems,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.status(201).json(riderInput);
});

// @desc    Get logged-in rider's input by date
// @route   GET /api/rider-inputs/my?date=2026-04-30
// @access  Private/Rider
export const getMyRiderInputByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  const riderInput = await RiderInput.findOne({
    rider: req.user._id,
    deliveryDate: normalizeDate(date),
  }).populate("rider", "firstName lastName username role");

  res.json(riderInput || null);
});

// @desc    Get all rider inputs by date - admin/controller only
// @route   GET /api/rider-inputs?date=2026-04-30
// @access  Private/Admin
export const getAllRiderInputsByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  const inputs = await RiderInput.find({
    deliveryDate: normalizeDate(date),
  })
    .populate("rider", "firstName lastName username role")
    .sort({ createdAt: -1 });

  res.json(inputs);
});