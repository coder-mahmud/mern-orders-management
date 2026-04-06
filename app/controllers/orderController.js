import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import HubStock from "../models/hubStockModel.js";
import Hub from "../models/hubModel.js";
import { logActivity } from "../utils/logActivity.js";
import User from "../models/userModels.js";


const getOrders = async (req, res) => {
  res.status(200).json({message:"Get all Orders route"})
}
const getOrderById = async (req, res) => {
  const {id} = req.params;
  // console.log("Order Id:", id)

  try {

    const order = await Order.findById(id);
    res.status(200).json({message:"success", order})
  } catch (error) {
    res.status(200).json({message:"failed", error})
  }


  
}

const getHubOrder = async (req, res) => {
  const { id, date } = req.params;
  // console.log("Hub data",id, date )

  try {
    const targetDate = new Date(date);
    const orders = await Order.find({
      hub:id,
      deliveryDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    }).populate("verifiedBy", "firstName").populate("statusChangedBy", "firstName");

    res.status(200).json({message:"Get hub Orders route", orders})
  } catch (error) {
    res.status(200).json({message:"Error", error})
  }

  
}

const createOrder = async (req, res) => {
  const {hub, orderItems, customerDetails,phoneNumber, orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user, orderType} = req.body
  // console.log("data",orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user )
  try {
    const newOrder = await Order.create({hub, orderItems, customerDetails, phoneNumber,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user,orderType})

    // Log activity
    await logActivity(user, "CREATE_ORDER", hub , `Created post on : ${hub}`, req);    

    res.status(201).json({message:"Order creates successfully!", order:newOrder})
  } catch (error) {
    res.status(404).json({message:"Failed", error})
  }
  
}

/*
// old controller before adding rider who delivers the order
const changeOrderStatus = async (req, res) => {
  const {orderId, status, statusChangeTime, statusChangedBy} = req.body
  // console.log("New Status", status)

  try {
    const order = await Order.findById(orderId);
    // console.log("order",order)
    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    order.statusChangeTime = statusChangeTime;
    order.statusChangedBy = statusChangedBy;
    // console.log("Old Status", oldStatus)


    
    if (oldStatus !== 'Delivered' && oldStatus !== 'Offline Delivery'){
      console.log("Decrementing first!")
      const hubId = order.hub;
      const updates = order.orderItems.map((item) => ({
        updateOne: {
          filter: { hubId, productId: item.productId },
          update: { 
            $inc: { quantity: -item.quantity },
            // $max: { quantity: 0 }
          },
        },
      }));
  
      await HubStock.bulkWrite(updates);



    }
    

    if ((oldStatus === 'Delivered' || oldStatus === 'Offline Delivery') && status === 'Cancelled') {
      // console.log("Delivery to cancelled!");
    
      const hubId = order.hub;

    
      const updates = order.orderItems.map((item) => ({
        updateOne: {
          filter: {
            hubId,
            productId:new mongoose.Types.ObjectId(item.productId)
          },
          update: {
            $inc: { quantity: item.quantity }
          },
        },
      }));
    
      const result = await HubStock.bulkWrite(updates);
      // console.log('Stock rollback result:', result);

    }
    

    // console.log("Saving order!")

    await order.save();
    res.status(200).json({message:"Success!", order})
  } catch (error) {
    console.log("Error",error)
    res.status(200).json({message:"Failed!", error})
  }




  
}
*/

const changeOrderStatus = async (req, res) => {
  const { orderId, status, statusChangeTime, statusChangedBy, riderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.orderStatus;

    order.orderStatus = status;
    order.statusChangeTime = statusChangeTime;
    order.statusChangedBy = statusChangedBy;

    // save rider only when delivered/offline delivered
    if (status === "Delivered" || status === "Offline Delivery") {
      if (!riderId) {
        return res.status(400).json({ message: "Rider is required for delivery" });
      }

      const rider = await User.findById(riderId);

      if (!rider) {
        return res.status(404).json({ message: "Rider not found" });
      }

      if (
        (Array.isArray(rider.role) && !rider.role.includes("rider")) ||
        (!Array.isArray(rider.role) && rider.role !== "rider")
      ) {
        return res.status(400).json({ message: "Selected user is not a rider" });
      }

      order.rider = riderId;
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    // if cancelled, rollback hub stock if already delivered before
    if ((oldStatus === "Delivered" || oldStatus === "Offline Delivery") && status === "Cancelled") {
      const hubId = order.hub;

      const updates = order.orderItems.map((item) => ({
        updateOne: {
          filter: {
            hubId,
            productId: new mongoose.Types.ObjectId(item.productId),
          },
          update: {
            $inc: { quantity: item.quantity },
          },
        },
      }));

      await HubStock.bulkWrite(updates);

      order.isDelivered = false;
      order.deliveredAt = null;
      order.rider = null;
    }

    // decrement hub stock only when moving from non-delivered to delivered/offline delivered
    if (
      (status === "Delivered" || status === "Offline Delivery") &&
      oldStatus !== "Delivered" &&
      oldStatus !== "Offline Delivery"
    ) {
      const hubId = order.hub;

      const updates = order.orderItems.map((item) => ({
        updateOne: {
          filter: { hubId, productId: item.productId },
          update: {
            $inc: { quantity: -item.quantity },
          },
        },
      }));

      await HubStock.bulkWrite(updates);
    }

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate("rider", "firstName lastName username")
      .populate("statusChangedBy", "firstName");

    res.status(200).json({ message: "Success!", order: populatedOrder });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Failed!", error: error.message });
  }
};

const changeVerifyStatus = async (req, res) => {
  const {orderId, verifyStatus,verifyTime,verifiedBy} = req.body
  console.log("New verifyStatus:", verifyStatus)
  console.log("Verify route hit!")

  
  try {
    const order = await Order.findById(orderId);
    // console.log("order",order)
    const oldStatus = order.verifyStatus;
    order.verifyStatus = verifyStatus;
    order.verifyTime = verifyTime;
    order.verifiedBy = verifiedBy;


    await order.save();

    const populatedOrder = await Order.findById(orderId).populate("verifiedBy");
    res.status(200).json({message:"Success!", order})
  } catch (error) {
    console.log("Error",error)
    res.status(200).json({message:"Failed!", error})
  }

//res.status(200).json({message:"verify Success!"})


  
}


const editOrder = async (req, res) => {
  console.log("editOrder route!")
  const {orderId,orderItems,finalPrice,discount, customerDetails,phoneNumber, deliveryDate,orderType  } = req.body;
  // console.log("Body data:", orderId,orderItems,finalPrice,discount)

  try {
    const order = await Order.findById(orderId);
    if(!order){
      throw new Error("Order not found!")
    }

    order.orderItems = orderItems || order.orderItems
    order.finalPrice = finalPrice || order.finalPrice
    order.discount = discount || order.discount
    order.customerDetails = customerDetails || order.customerDetails
    order.phoneNumber = phoneNumber || order.phoneNumber
    order.deliveryDate = deliveryDate || order.deliveryDate
    order.orderType = orderType || order.orderType

    const updatedOrder = await order.save();

    res.status(200).json({success:true, order: updatedOrder})
  } catch (error) {
    res.status(500).json({success:false, error: error.message})
  }


  
}

const deleteOrder = async (req, res) => {
  const {orderId} = req.body
  console.log("To delete order Id:", orderId );
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
}


const getOrderByDate = async (req, res) => {
  const {date} =  req.params;
  // console.log("date",date)
  const targetDate = new Date(date);

  try {
    const datedOrders = await Order.find({
      deliveryDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },

    }).populate('hub', 'name type')
    res.status(200).json({success:true, orders:datedOrders})
  } catch (error) {
    res.status(200).json({success:false, error:error.message})
  }

  
}

const searchOrders = async (req, res) => {
  console.log("Search order hit!")
  
  try {
    let { phone, productIds, startDate, endDate, page = 1, limit = 100 } = req.query;
  
    const query = {};
  
    if (phone) {
      query.phoneNumber = phone.replace(/\+/g, "").replace(/\s/g, "");
    }
  
    // support multiple products
    if (productIds) {
      // convert string to array if passed as CSV
      if (typeof productIds === "string") {
        productIds = productIds.split(",");
      }
      query["orderItems.productId"] = { $in: productIds };
    }
  
    if (startDate && endDate) {
      query.deliveryDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
  
    const skip = (parseInt(page) - 1) * parseInt(limit);
  
    const orders = await Order.find(query)
      .sort({ deliveryDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
  
    const total = await Order.countDocuments(query);
  
    res.json({
      data: orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }


  /*
  try {
    const { phone, start, end, productId } = req.query;
    
    console.log("phone:", phone)

    const query = {};

    // Phone + date range
    if (phone) {
      query.phoneNumber = phone;
    }

    if (start && end) {
      query.deliveryDate = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    // Product + date range
    if (productId) {
      query["orderItems.productId"] = productId;
    }

    const orders = await Order.find(query)
      .sort({ deliveryDate: -1 }) // latest first
      .skip(skip)
      .limit(100); // optional: limit results for performance

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  */



  
}



export { getOrders, createOrder, editOrder, deleteOrder, getHubOrder,getOrderById, changeOrderStatus, getOrderByDate,changeVerifyStatus, searchOrders }