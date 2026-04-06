import RiderStock from "../models/riderStockModel.js";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import User from "../models/userModels.js";

const getRiderStocks = async (req, res) => {
  try {
    const riderStocks = await RiderStock.find({})
      .populate("rider", "firstName lastName username role phone")
      .populate("items.productId", "name");

    res.status(200).json({ success: true, riderStocks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRiderStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const riderStock = await RiderStock.findById(id)
      .populate("rider", "firstName lastName username role phone")
      .populate("items.productId", "name");

    if (!riderStock) {
      return res.status(404).json({ success: false, message: "Rider stock not found" });
    }

    res.status(200).json({ success: true, riderStock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createOrUpdateRiderStock = async (req, res) => {
  const { riderId, date, items } = req.body;

  try {
    if (!riderId || !date || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "riderId, date and items are required",
      });
    }

    const rider = await User.findById(riderId);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider user not found",
      });
    }

    // if you use single role string:
    // if (rider.role !== "rider") { ... }

    // if you use multiple roles array:
    if (
      (Array.isArray(rider.role) && !rider.role.includes("rider")) ||
      (!Array.isArray(rider.role) && rider.role !== "rider")
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a rider",
      });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const formattedItems = items.map((item) => ({
      productId: item.productId,
      assignedQty: Number(item.assignedQty || 0),
    }));

    const existingStock = await RiderStock.findOne({
      rider: riderId,
      date: normalizedDate,
    });

    if (existingStock) {
      existingStock.items = formattedItems;
      const updatedStock = await existingStock.save();

      const populatedStock = await RiderStock.findById(updatedStock._id)
        .populate("rider", "firstName lastName username role phone")
        .populate("items.productId", "name");

      return res.status(200).json({
        success: true,
        message: "Rider stock updated successfully",
        riderStock: populatedStock,
      });
    }

    const newStock = await RiderStock.create({
      rider: riderId,
      date: normalizedDate,
      items: formattedItems,
    });

    const populatedStock = await RiderStock.findById(newStock._id)
      .populate("rider", "firstName lastName username role phone")
      .populate("items.productId", "name");

    res.status(201).json({
      success: true,
      message: "Rider stock created successfully",
      riderStock: populatedStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const editRiderStock = async (req, res) => {
  const { stockId, items } = req.body;

  try {
    const riderStock = await RiderStock.findById(stockId);

    if (!riderStock) {
      return res.status(404).json({
        success: false,
        message: "Rider stock not found",
      });
    }

    if (items && Array.isArray(items)) {
      riderStock.items = items.map((item) => ({
        productId: item.productId,
        assignedQty: Number(item.assignedQty || 0),
      }));
    }

    const updatedStock = await riderStock.save();

    const populatedStock = await RiderStock.findById(updatedStock._id)
      .populate("rider", "firstName lastName username role phone")
      .populate("items.productId", "name");

    res.status(200).json({
      success: true,
      message: "Rider stock updated successfully",
      riderStock: populatedStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteRiderStock = async (req, res) => {
  const { stockId } = req.body;

  try {
    const deletedStock = await RiderStock.findByIdAndDelete(stockId);

    if (!deletedStock) {
      return res.status(404).json({
        success: false,
        message: "Rider stock not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rider stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getRiderStockByDate = async (req, res) => {
  const { riderId, date } = req.params;

  try {
    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const riderStock = await RiderStock.findOne({
      rider: riderId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("rider", "firstName lastName username role phone")
      .populate("items.productId", "name");

    if (!riderStock) {
      return res.status(404).json({
        success: false,
        message: "No rider stock found for this date",
      });
    }

    res.status(200).json({
      success: true,
      riderStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
const getRiderRemainingStock = async (req, res) => {
  const { riderId, date } = req.params;

  try {
    const targetDate = new Date(date);

    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const rider = await User.findById(riderId).select(
      "firstName lastName username role phone"
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    const riderStock = await RiderStock.findOne({
      rider: riderId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("items.productId", "name");

    if (!riderStock) {
      return res.status(404).json({
        success: false,
        message: "No rider stock found for this date",
      });
    }

    const deliveredOrders = await Order.find({
      rider: riderId,
      isDelivered: true,
      deliveredAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};

    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        deliveredMap[productId] = (deliveredMap[productId] || 0) + Number(item.quantity || 0);
      }
    }

    const remainingItems = riderStock.items.map((item) => {
      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      const deliveredQty = deliveredMap[productId] || 0;
      const assignedQty = Number(item.assignedQty || 0);
      const remainingQty = assignedQty - deliveredQty;

      return {
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
      };
    });

    res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

*/

const getRiderRemainingStock = async (req, res) => {
  const { riderId, date } = req.params;

  try {
    const targetDate = new Date(date);

    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const rider = await User.findById(riderId).select(
      "firstName lastName username role phone"
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    const riderStock = await RiderStock.findOne({
      rider: riderId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("items.productId", "name");

    if (!riderStock) {
      return res.status(404).json({
        success: false,
        message: "No rider stock found for this date",
      });
    }

    const deliveredOrders = await Order.find({
      rider: riderId,
      isDelivered: true,
      deliveryDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};

    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        deliveredMap[productId] =
          (deliveredMap[productId] || 0) + Number(item.quantity || 0);
      }
    }

    const remainingItems = riderStock.items.map((item) => {
      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      const deliveredQty = deliveredMap[productId] || 0;
      const assignedQty = Number(item.assignedQty || 0);
      const remainingQty = assignedQty - deliveredQty;

      return {
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
      };
    });

    res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRiderDeliverySummary = async (req, res) => {
  const { riderId, date } = req.params;

  try {
    const targetDate = new Date(date);

    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const deliveredOrders = await Order.find({
      rider: riderId,
      isDelivered: true,
      deliveredAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("rider", "firstName lastName")
      .populate("orderItems.productId", "name")
      .populate("hub", "name");

    res.status(200).json({
      success: true,
      totalOrders: deliveredOrders.length,
      orders: deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  getRiderStocks,
  getRiderStockById,
  createOrUpdateRiderStock,
  editRiderStock,
  deleteRiderStock,
  getRiderStockByDate,
  getRiderRemainingStock,
  getRiderDeliverySummary,
};