import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import Hub from "../models/hubModel.js";
import InternalReport from "../models/internalReportModel.js";


const getInternalReports = async (req, res) => {
  res.status(200).json({message:"Get all internal reports route"})
}


const getInternalReportsByDate = async (req, res) => {
  const {date} =  req.params;
  console.log("date",date)
  const targetDate = new Date(date);
  try {
    const datedReports = await InternalReport.find({
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




const createInternalReport = async (req, res) => {
  const {hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery, reportType, orderCount, rider} = req.body
  // console.log("data",hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery,rider)
  console.log("rider",rider)
  

  
  try {
    const newReport = await InternalReport.create({hub, orderItems, deliveryDate, user, onlineDelivery, offlineDelivery, reportType, orderCount, rider})
    res.status(201).json({message:"Internal Report created successfully!", report:newReport})
  } catch (error) {
    res.status(404).json({message:"Failed", error})
  }
  
  
}


export {getInternalReports, createInternalReport, getInternalReportsByDate  }