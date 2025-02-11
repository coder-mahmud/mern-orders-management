import Product from "../models/productModel.js";
import mongoose from "mongoose";


const createProduct = async (req, res) => {
  res.status(200).json({message:"Create Product route"})
}

const getProducts = async (req, res) => {
  res.status(200).json({message:"Get Products route"})
}

const editProduct = async (req, res) => {
  res.status(200).json({message:"Edit Product route"})
}

export { createProduct, getProducts, editProduct }