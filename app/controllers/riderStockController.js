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
*/
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
      deliveryDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};
    const deliveredNameMap = {};

    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        deliveredMap[productId] =
          (deliveredMap[productId] || 0) + Number(item.quantity || 0);

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] = item.productId?.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const deliveredQty = deliveredMap[productId] || 0;
      const assignedQty = Number(item.assignedQty || 0);
      const remainingQty = assignedQty - deliveredQty;

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
      });
    }

    // Add items that were delivered but not assigned initially
    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
        });
      }
    }

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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
    const deliveredNameMap = {};
    const totalPriceMap = {};

    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const price =
          Number(item.price || item.unitPrice || item.salePrice || 0) * quantity;

        deliveredMap[productId] = (deliveredMap[productId] || 0) + quantity;
        totalPriceMap[productId] = (totalPriceMap[productId] || 0) + price;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] = item.productId?.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const totalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice,
      });
    }

    // Delivered but not assigned initially
    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const totalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    const grandTotalOrderPrice = remainingItems.reduce(
      (sum, item) => sum + Number(item.totalOrderPrice || 0),
      0
    );

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalOrderPrice,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


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
    const deliveredNameMap = {};
    const totalPriceMap = {};

    let grandTotalFinalPrice = 0;

    for (const order of deliveredOrders) {
      grandTotalFinalPrice += Number(order.finalPrice || 0);

      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const itemTotalPrice = Number(item.totalPrice || 0);

        deliveredMap[productId] = (deliveredMap[productId] || 0) + quantity;
        totalPriceMap[productId] = (totalPriceMap[productId] || 0) + itemTotalPrice;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] = item.productId?.name || item.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const totalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice,
      });
    }

    // Add items delivered but not assigned initially
    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const totalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalFinalPrice,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};




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
      date: { $gte: startDate, $lte: endDate },
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
      deliveryDate: { $gte: startDate, $lte: endDate },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};
    const deliveredNameMap = {};
    const totalPriceMap = {};

    let grandTotalFinalPrice = 0;

    for (const order of deliveredOrders) {
      // ✅ GRAND TOTAL FROM FINAL PRICE
      grandTotalFinalPrice += Number(order.finalPrice || 0);

      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const itemTotalPrice = Number(item.totalPrice || 0);

        deliveredMap[productId] =
          (deliveredMap[productId] || 0) + quantity;

        totalPriceMap[productId] =
          (totalPriceMap[productId] || 0) + itemTotalPrice;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] =
            item.productId?.name || item.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const totalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice,
      });
    }

    // ✅ Handle delivered but not assigned (negative stock)
    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const totalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalFinalPrice,
      remainingItems,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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
      date: { $gte: startDate, $lte: endDate },
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
      deliveryDate: { $gte: startDate, $lte: endDate },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};
    const deliveredNameMap = {};
    const totalPriceMap = {};

    let grandTotalFinalPrice = 0;

    for (const order of deliveredOrders) {
      // ✅ GRAND TOTAL FROM FINAL PRICE
      grandTotalFinalPrice += Number(order.finalPrice || 0);

      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const itemTotalPrice = Number(item.totalPrice || 0);

        deliveredMap[productId] =
          (deliveredMap[productId] || 0) + quantity;

        totalPriceMap[productId] =
          (totalPriceMap[productId] || 0) + itemTotalPrice;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] =
            item.productId?.name || item.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const totalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice,
      });
    }

    // ✅ Handle delivered but not assigned (negative stock)
    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const totalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    
    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalFinalPrice,
      remainingItems,
    });
    





  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


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
      date: { $gte: startDate, $lte: endDate },
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
      deliveryDate: { $gte: startDate, $lte: endDate },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};
    const deliveredNameMap = {};
    const totalPriceMap = {};

    let grandTotalFinalPrice = 0;

    for (const order of deliveredOrders) {
      grandTotalFinalPrice += Number(order.finalPrice || 0);

      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const itemTotalPrice = Number(item.totalPrice || 0);

        deliveredMap[productId] = (deliveredMap[productId] || 0) + quantity;
        totalPriceMap[productId] = (totalPriceMap[productId] || 0) + itemTotalPrice;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] =
            item.productId?.name || item.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const totalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice,
      });
    }

    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const totalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    const deliveredSummary = remainingItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: Number(item.deliveredQty || 0),
    }));

    const remainingSummary = remainingItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: Number(item.remainingQty || 0),
    }));

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalFinalPrice,
      remainingItems,
      deliveredSummary,
      remainingSummary,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
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
      date: { $gte: startDate, $lte: endDate },
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
      deliveryDate: { $gte: startDate, $lte: endDate },
    }).populate("orderItems.productId", "name");

    const deliveredMap = {};
    const deliveredNameMap = {};
    const totalPriceMap = {};

    let grandTotalFinalPrice = 0;
    let totalDiscount = 0;
    let totalOrderPrice = 0;
    let totalDeliveryCharge = 0;

    for (const order of deliveredOrders) {
      grandTotalFinalPrice += Number(order.finalPrice || 0);
      totalDiscount += Number(order.discount || 0);
      totalOrderPrice += Number(order.orderPrice || 0);
      totalDeliveryCharge += Number(order.deliveryCharge || 0);

      for (const item of order.orderItems) {
        if (!item.productId) continue;

        const productId = item.productId?._id
          ? item.productId._id.toString()
          : item.productId.toString();

        const quantity = Number(item.quantity || 0);
        const itemTotalPrice = Number(item.totalPrice || 0);

        deliveredMap[productId] = (deliveredMap[productId] || 0) + quantity;
        totalPriceMap[productId] = (totalPriceMap[productId] || 0) + itemTotalPrice;

        if (!deliveredNameMap[productId]) {
          deliveredNameMap[productId] =
            item.productId?.name || item.name || "";
        }
      }
    }

    const remainingItems = [];
    const assignedProductIds = new Set();

    for (const item of riderStock.items) {
      if (!item.productId) continue;

      const productId = item.productId?._id
        ? item.productId._id.toString()
        : item.productId.toString();

      assignedProductIds.add(productId);

      const assignedQty = Number(item.assignedQty || 0);
      const deliveredQty = Number(deliveredMap[productId] || 0);
      const remainingQty = assignedQty - deliveredQty;
      const itemWiseTotalOrderPrice = Number(totalPriceMap[productId] || 0);

      remainingItems.push({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || "",
        assignedQty,
        deliveredQty,
        remainingQty,
        totalOrderPrice: itemWiseTotalOrderPrice,
      });
    }

    for (const productId in deliveredMap) {
      if (!assignedProductIds.has(productId)) {
        const deliveredQty = Number(deliveredMap[productId] || 0);
        const itemWiseTotalOrderPrice = Number(totalPriceMap[productId] || 0);

        remainingItems.push({
          productId,
          productName: deliveredNameMap[productId] || "",
          assignedQty: 0,
          deliveredQty,
          remainingQty: -deliveredQty,
          totalOrderPrice: itemWiseTotalOrderPrice,
        });
      }
    }

    const totalDeliveredQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.deliveredQty || 0),
      0
    );

    const deliveredSummary = remainingItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: Number(item.deliveredQty || 0),
    }));

    const remainingSummary = remainingItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: Number(item.remainingQty || 0),
    }));

    return res.status(200).json({
      success: true,
      rider,
      date: startDate,
      totalDeliveredOrders: deliveredOrders.length,
      totalDeliveredQty,
      grandTotalFinalPrice,
      totalDiscount,
      totalOrderPrice,
      totalDeliveryCharge,
      remainingItems,
      deliveredSummary,
      remainingSummary,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
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