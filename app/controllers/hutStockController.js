import Hub from "../models/hubModel.js";
import HubStock from "../models/hubStockModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";



const createHubStock = async (req, res) => {
  // const {hubId,productId,quantity} = req.body
  try {
    const hubs = await Hub.find({});
    const products = await Product.find({});

    // console.log("hubs", hubs )
    // console.log("products",products )

    const bulkOps = [];

    for (const hub of hubs) {
      for (const product of products) {
        bulkOps.push({
          updateOne: {
            filter: { hubId: hub._id, productId: product._id },
            update: { $setOnInsert: { quantity: 0 } },
            upsert: true
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      await HubStock.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: 'Stock initialized successfully' });
  } catch (error) {
    console.error('Stock initialization failed:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
  
}


const createStockforHub = async (req, res) => {
  const {hubId} = req.body
  if(!hubId){
    return res.status(300).json({ error: 'Please add hub id' });
  }
  
  try {
    const products = await Product.find({});

    const bulkOps = [];

    for (const product of products) {
      bulkOps.push({
        updateOne: {
          filter: { hubId, productId: product._id },
          update: { $setOnInsert: { quantity: 0 } },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      await HubStock.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: 'Stock initialized for hub successfully' });
  } catch (error) {
    console.error('Stock initialization failed:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
  
}

const editHubStock = async (req,res) =>{
  const {stockId, quantity, stockChangeTime, stockChangedBy} = req.body
  console.log("stock update Body", stockId, quantity, stockChangeTime, stockChangedBy)
  try {
    const stock = await HubStock.findByIdAndUpdate(
      stockId,
      { quantity,stockChangeTime,stockChangedBy },
      { new: true }
    ).populate({
      path: 'productId',
      select: 'name'
    }).populate({
      path: 'hubId',
      select: 'name'
    }).populate({
      path: 'stockChangedBy',
      select: 'firstName'
    });

    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Stock updated successfully",
      stock 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating stock",
      error: error.message 
    });
  }
}

const getHubStock = async (req, res) => {
  const { hubId } = req.params;
  // console.log("Hub Id:", hubId)
  if(!hubId){
    return res.status(300).json({message:"No hub id provided!"})
  }
  const hubStock = await HubStock.find({hubId}).populate({
    path: 'productId',
    select: 'name'
  }).populate({
    path: 'hubId',
    select: 'name'
  }).populate({
    path: 'stockChangedBy',
    select: 'firstName'
  });
  res.status(200).json({hubStock})
}


const deductStockitem = async (req, res) => {
  const { hubId,productId,quantity } = req.body;
  // console.log("Hub Id:", hubId)
  if(!hubId){
    return res.status(300).json({message:"No Hub id provided!"})
  }
  if(!productId){
    return res.status(300).json({message:"No Product id provided!"})
  }
  
  try {
    const hubStock = await HubStock.findOne({ hubId, productId });
  
    if (!hubStock) {
      throw new Error("Stock not found!");
    }
  
    hubStock.quantity = hubStock.quantity - quantity;
  
    const updated = await hubStock.save();
  
    res.status(200).json({ updated });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message, error });
  }
  
  
  
}






export {createHubStock,editHubStock,getHubStock, createStockforHub, deductStockitem}