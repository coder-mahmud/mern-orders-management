import Hub from "../models/hubModel.js";
import mongoose from "mongoose";




const getHubs = async (req, res) => {
  const allHubs = await Hub.find();
  res.status(200).json({hubs:allHubs})
}


const getHubById = async (req, res) => {
  const { id } = req.params;
  // console.log("Hub ID", id)

  try {
    const hub = await Hub.findById(id);
    res.status(200).json({hub})
  } catch (error) {
    res.status(403).json({error:error})
  }


  
  // res.status(200).json({message:`Hub Id: ${id}` })
}

const createHub = async (req, res) => {
  const {name, stock} = req.body

  // console.log(name, stock)
  try {
    const newHub = await Hub.create({name, stock})
    res.status(201).json({success:true, hub:newHub})
  } catch (error) {
    res.status(403).json({success:false, message:error.message})
  }

  
}

const editHub = async (req,res) =>{
  res.status(200).json({message:"Hub edit route"})
}

export {createHub, editHub, getHubs, getHubById}