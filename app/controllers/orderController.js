import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import HubStock from "../models/hubStockModel.js";


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
  console.log("Hub data",id, date )

  try {
    const targetDate = new Date(date);
    const orders = await Order.find({
      hub:id,
      deliveryDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    });

    res.status(200).json({message:"Get hub Orders route", orders})
  } catch (error) {
    res.status(200).json({message:"Error", error})
  }

  
}

const createOrder = async (req, res) => {
  const {hub, orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user, orderType} = req.body
  // console.log("data",orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user )
  try {
    const newOrder = await Order.create({hub, orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user,orderType})
    res.status(201).json({message:"Order creates successfully!", order:newOrder})
  } catch (error) {
    res.status(404).json({message:"Failed", error})
  }
  
}

const changeOrderStatus = async (req, res) => {
  const {orderId, status} = req.body
  console.log("Status", status)

  try {
    const order = await Order.findById(orderId);
    order.orderStatus = status;
    if(status == 'Delivered' || status == "Offline Delivery"){

      const hubId = order.hub;
      const updates = order.orderItems.map((item) => ({
        updateOne: {
          filter: { hubId, productId: item.productId },
          update: { 
            $inc: { quantity: -item.quantity },
            $max: { quantity: 0 }
          },
        },
      }));
  
      await HubStock.bulkWrite(updates);



    }


    await order.save();
    res.status(200).json({message:"Success!", order})
  } catch (error) {
    res.status(200).json({message:"Failed!", error})
  }




  
}


const editOrder = async (req, res) => {
  console.log("editOrder route!")
  const {orderId,orderItems,finalPrice,discount, customerDetails,deliveryDate,orderType  } = req.body;
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

    })
    res.status(200).json({success:true, orders:datedOrders})
  } catch (error) {
    res.status(200).json({success:false, error:error.message})
  }

  
}

export { getOrders, createOrder, editOrder, deleteOrder, getHubOrder,getOrderById, changeOrderStatus, getOrderByDate }