// this is controller for rider's own input

import asyncHandler from "express-async-handler";
import RiderInput from "../models/riderInputModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModels.js";

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};


// input from rider's own input
export const createRiderInput = asyncHandler(async (req, res) => {
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

  const existingInput = await RiderInput.findOne({
    rider,
    deliveryDate: dateOnly,
  });

  if (existingInput) {
    res.status(400);
    throw new Error("You already submitted entry for this date. You cannot edit or submit again.");
  }

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

  const riderInput = await RiderInput.create({
    rider,
    deliveryDate: dateOnly,
    items: cleanedItems,
  });

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



export const updateRiderInputByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { items, extraNote } = req.body;

  const riderInput = await RiderInput.findById(id);

  if (!riderInput) {
    res.status(404);
    throw new Error("Rider input not found");
  }

  if (!items || !Array.isArray(items)) {
    res.status(400);
    throw new Error("Items are required");
  }

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

  riderInput.items = cleanedItems;
  riderInput.extraNote = extraNote || "";

  const updatedInput = await riderInput.save();

  res.status(200).json(updatedInput);
});


// @desc    Create or update rider delivery input by admin/staff
// @route   POST /api/rider-inputs/admin-entry
// @access  Private/Admin/Staff
export const createOrUpdateRiderInputByAdmin = asyncHandler(async (req, res) => {
  const { riderId, deliveryDate, items, extraNote } = req.body;

  if (!riderId) {
    res.status(400);
    throw new Error("Please select a rider");
  }

  if (!deliveryDate) {
    res.status(400);
    throw new Error("Delivery date is required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("At least one product quantity is required");
  }

  const riderUser = await User.findById(riderId).select(
    "firstName lastName username role"
  );

  if (!riderUser) {
    res.status(404);
    throw new Error("Rider not found");
  }

  const isRider = Array.isArray(riderUser.role)
    ? riderUser.role.includes("rider")
    : riderUser.role === "rider";

  if (!isRider) {
    res.status(400);
    throw new Error("Selected user is not a rider");
  }

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
  const uniqueProductIds = [...new Set(productIds.map(String))];

  const products = await Product.find({
    _id: { $in: uniqueProductIds },
    active: true,
  }).select("name");

  if (products.length !== uniqueProductIds.length) {
    res.status(400);
    throw new Error("One or more products are invalid or inactive");
  }

  const productNameMap = new Map(
    products.map((product) => [product._id.toString(), product.name])
  );

  const finalItems = cleanedItems.map((item) => ({
    product: item.product,
    name: productNameMap.get(item.product.toString()) || item.name,
    quantity: item.quantity,
  }));

  const dateOnly = normalizeDate(deliveryDate);

  let riderInput = await RiderInput.findOne({
    rider: riderId,
    deliveryDate: dateOnly,
  });

  const isNewEntry = !riderInput;

  if (riderInput) {
    riderInput.items = finalItems;
    riderInput.extraNote = extraNote || "";
  } else {
    riderInput = new RiderInput({
      rider: riderId,
      deliveryDate: dateOnly,
      items: finalItems,
      extraNote: extraNote || "",
    });
  }

  const savedInput = await riderInput.save();

  res.status(isNewEntry ? 201 : 200).json({
    message: isNewEntry
      ? "Rider delivered input saved successfully"
      : "Rider delivered input updated successfully",
    riderInput: savedInput,
  });
});


// @desc    Get one rider delivery input by rider and date for admin/staff
// @route   GET /api/rider-inputs/admin-entry?riderId=xxx&date=2026-04-30
// @access  Private/Admin/Staff
export const getRiderInputByRiderAndDateForAdmin = asyncHandler(
  async (req, res) => {
    const { riderId, date } = req.query;

    if (!riderId) {
      res.status(400);
      throw new Error("Rider is required");
    }

    if (!date) {
      res.status(400);
      throw new Error("Date is required");
    }

    const riderInput = await RiderInput.findOne({
      rider: riderId,
      deliveryDate: normalizeDate(date),
    }).populate("rider", "firstName lastName username role");

    res.json(riderInput || null);
  }
);