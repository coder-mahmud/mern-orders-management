import RiderStock from "../models/riderStockModel.js";
import RiderInput from "../models/riderInputModel.js";
import Order from "../models/orderModel.js";

const getDateRange = (date) => {
  const targetDate = new Date(date);

  const startDate = new Date(targetDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(targetDate);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

const getProductId = (value) => {
  if (!value) return null;
  if (value._id) return value._id.toString();
  return value.toString();
};

// @desc    Compare rider input with system delivered qty for all riders
// @route   GET /api/rider-comparison/:date
// @access  Private/Admin/Controller
const getAllRiderProductComparisonByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const { startDate, endDate } = getDateRange(date);

    const riderStocks = await RiderStock.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("rider", "firstName lastName username phone role")
      .populate("items.productId", "name");

    const reports = await Promise.all(
      riderStocks.map(async (stock) => {
        const riderId = getProductId(stock.rider);

        const riderInput = await RiderInput.findOne({
          rider: riderId,
          deliveryDate: { $gte: startDate, $lte: endDate },
        });

        // 1. Fetch system marked delivered orders
        const deliveredOrders = await Order.find({
          rider: riderId,
          isDelivered: true,
          deliveryDate: { $gte: startDate, $lte: endDate },
        }).populate("orderItems.productId", "name");

        // 2. Fetch rider marked delivered orders via dropdown actions
        const riderDeliveredOrders = await Order.find({
          rider: riderId,
          deliveryStatusByRider: "Delivered",
          deliveryDate: { $gte: startDate, $lte: endDate },
        }).populate("orderItems.productId", "name");

        const stockMap = {};
        const riderInputMap = {};
        const systemDeliveredMap = {};
        const riderDeliveredMap = {};
        const productNameMap = {};

        stock.items.forEach((item) => {
          const productId = getProductId(item.productId);
          if (!productId) return;

          stockMap[productId] = Number(item.assignedQty || 0);
          productNameMap[productId] = item.productId?.name || "";
        });

        riderInput?.items?.forEach((item) => {
          const productId = getProductId(item.product);
          if (!productId) return;

          riderInputMap[productId] = Number(item.quantity || 0);
          productNameMap[productId] =
            item.name || productNameMap[productId] || "";
        });

        deliveredOrders.forEach((order) => {
          order.orderItems?.forEach((item) => {
            const productId = getProductId(item.productId);
            if (!productId) return;

            systemDeliveredMap[productId] =
              Number(systemDeliveredMap[productId] || 0) +
              Number(item.quantity || 0);

            productNameMap[productId] =
              item.productId?.name ||
              item.name ||
              productNameMap[productId] ||
              "";
          });
        });

        // Map rider delivered order items quantities
        riderDeliveredOrders.forEach((order) => {
          order.orderItems?.forEach((item) => {
            const productId = getProductId(item.productId);
            if (!productId) return;

            riderDeliveredMap[productId] =
              Number(riderDeliveredMap[productId] || 0) +
              Number(item.quantity || 0);

            productNameMap[productId] =
              item.productId?.name ||
              item.name ||
              productNameMap[productId] ||
              "";
          });
        });

        const allProductIds = new Set([
          ...Object.keys(stockMap),
          ...Object.keys(riderInputMap),
          ...Object.keys(systemDeliveredMap),
          ...Object.keys(riderDeliveredMap),
        ]);

        const items = Array.from(allProductIds).map((productId) => {
          const assignedQty = Number(stockMap[productId] || 0);
          const riderInputQty = Number(riderInputMap[productId] || 0);
          const systemDeliveredQty = Number(systemDeliveredMap[productId] || 0);
          const riderDeliveredQty = Number(riderDeliveredMap[productId] || 0);

          return {
            productId,
            productName: productNameMap[productId] || "Unknown Product",
            assignedQty,
            systemDeliveredQty,
            riderDeliveredQty,
            riderInputQty,
            difference: riderDeliveredQty - systemDeliveredQty,
            remainingQty: assignedQty - systemDeliveredQty,
            // UPDATED LOGIC: Comparing System Delivered vs Rider Delivered
            isMatched: systemDeliveredQty === riderDeliveredQty,
          };
        });

        const totalAssignedQty = items.reduce(
          (sum, item) => sum + item.assignedQty,
          0
        );

        const totalSystemDeliveredQty = items.reduce(
          (sum, item) => sum + item.systemDeliveredQty,
          0
        );

        const totalRiderDeliveredQty = items.reduce(
          (sum, item) => sum + item.riderDeliveredQty,
          0
        );

        const totalRiderInputQty = items.reduce(
          (sum, item) => sum + item.riderInputQty,
          0
        );

        // UPDATED LOGIC: Set overall mismatch if any product item fails to match
        const hasMismatch = items.some((item) => !item.isMatched);

        return {
          rider: stock.rider,
          date: startDate,
          hasRiderInput: Boolean(riderInput),
          riderInputId: riderInput?._id || null,
          hasMismatch,
          totalSystemOrders: deliveredOrders.length,
          totalRiderOrders: riderDeliveredOrders.length,
          totalAssignedQty,
          totalSystemDeliveredQty,
          totalRiderDeliveredQty,
          totalRiderInputQty,
          totalDifference: totalRiderDeliveredQty - totalSystemDeliveredQty,
          items,
          totalDeliveredOrders: deliveredOrders.length,
          extraNote: riderInput?.extraNote || "",
        };
      })
    );

    res.status(200).json({
      success: true,
      date: startDate,
      riders: reports,
    });
  } catch (error) {
    console.log("Rider comparison error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get rider comparison report",
      error: error.message,
    });
  }
};

export { getAllRiderProductComparisonByDate };