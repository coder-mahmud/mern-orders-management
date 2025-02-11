import Order from "../models/orderModel.js";
import mongoose from "mongoose";


const getOrders = async (req, res) => {
  res.status(200).json({message:"Get all Orders route"})
}

const createOrder = async (req, res) => {
  res.status(200).json({message:"Create Order route"})
}

const editOrder = async (req, res) => {
  res.status(200).json({message:"Edit Order route"})
}

const deleteOrder = async (req, res) => {
  res.status(200).json({message:"Delete Order route"})
}

export { getOrders, createOrder, editOrder, deleteOrder }