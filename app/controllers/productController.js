import Product from "../models/productModel.js";
import mongoose from "mongoose";


const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    console.log(name,price)
    
    const product = await Product.create({
      name,
      price
    });

    return res.status(201).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

const getProducts = async (req, res) => {

  const allProducts = await Product.find();
  res.status(200).json({message:"success", products:allProducts})
}

const editProduct = async (req, res) => {
  res.status(200).json({message:"Edit Product route"})
}

export { createProduct, getProducts, editProduct }