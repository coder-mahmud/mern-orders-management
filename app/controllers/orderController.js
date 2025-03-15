import Order from "../models/orderModel.js";
import mongoose from "mongoose";


const getOrders = async (req, res) => {
  res.status(200).json({message:"Get all Orders route"})
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
  const {hub, orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user} = req.body
  // console.log("data",orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user )
  try {
    const newOrder = await Order.create({hub, orderItems, customerDetails,orderPrice, deliveryCharge,discount, finalPrice,deliveryDate, user})
    res.status(201).json({message:"Order creates successfully!", order:newOrder})
  } catch (error) {
    res.status(404).json({message:"Failed", error})
  }
  
}

const editOrder = async (req, res) => {
  res.status(200).json({message:"Edit Order route"})
}

const deleteOrder = async (req, res) => {
  res.status(200).json({message:"Delete Order route"})
}

export { getOrders, createOrder, editOrder, deleteOrder, getHubOrder }