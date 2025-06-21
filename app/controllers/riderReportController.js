import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import Hub from "../models/hubModel.js";
import RiderReport from "../models/riderReportModel.js";


const getRiderReports = async (req, res) => {
  res.status(200).json({message:"Get all rider reports route"})
}


const getRiderReportsByDate = async (req, res) => {
  const {date} =  req.params;
  console.log("date",date)
  const targetDate = new Date(date);
  try {
    const datedReports = await RiderReport.find({
      deliveryDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },

    }).populate('hub', 'name').populate('user','firstName')
    res.status(200).json({success:true, reports:datedReports})
  } catch (error) {
    res.status(200).json({success:false, error:error.message})
  }

  //res.status(200).json({message:"Get rider reports by date route"})
}




const createRiderReport = async (req, res) => {
  const {hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery, reportType, orderCount} = req.body
  console.log("data",hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery)
  
  //res.status(201).json({message:"Create rider reprot !"})

  
  try {
    const newReport = await RiderReport.create({hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery, reportType, orderCount})
    res.status(201).json({message:"Report created successfully!", report:newReport})
  } catch (error) {
    res.status(404).json({message:"Failed", error})
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

    }).populate('hub', 'name type')
    res.status(200).json({success:true, orders:datedOrders})
  } catch (error) {
    res.status(200).json({success:false, error:error.message})
  }

  
}

export { getRiderReports, createRiderReport,getRiderReportsByDate }