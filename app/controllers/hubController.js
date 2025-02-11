import Hub from "../models/hubModel.js";
import mongoose from "mongoose";




const getHubs = async (req, res) => {
  res.status(200).json({message:"Get all Hub route"})
}

const createHub = async (req, res) => {
  res.status(200).json({message:"Hub create route"})
}

const editHub = async (req,res) =>{
  res.status(200).json({message:"Hub edit route"})
}

export {createHub, editHub,getHubs}