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

const addProductToHub = async (req,res) => {
  const {productsData, id} = req.body
  // console.log("productsData", productsData)
  // console.log("hub id", id)

  try {
    const hub = await Hub.findById(id);
    hub.stock = [...hub.stock,...productsData]
    const updatedHub = await hub.save();
    res.status(201).json({success:true, hub:updatedHub})
  } catch (error) {
    res.status(401).json({success:false, error:error.message})
  }

  
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
  const {stockData, hubId} = req.body

  const hub = await Hub.findById(hubId);
  if(!hub){
    return res.status(404).json({message:"Hub not found"})
  }
  // console.log(stockData,hubId )
  // console.log("hub", hub)

  



  try {

    let newStock;
    if(stockData.type === 'increase'){
      newStock = hub.stock.map(stockItem => {
        if (stockItem.productId.toString() === stockData.productId) {
          return {
            ...stockItem,
            stock: Number(stockItem.stock) + Number(stockData.amount) 
          };
        }
        return stockItem;
      });
    }else if(stockData.type === 'decrease'){
      newStock = hub.stock.map(stockItem => {
        if (stockItem.productId.toString() === stockData.productId) {
          return {
            ...stockItem,
            stock: Number(stockItem.stock) - Number(stockData.amount) 
          };
        }
        return stockItem;
      });
    }
    
  
    hub.stock = newStock;
    const updatedHub = await hub.save();
    
    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedHub
    });

    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Operatin failed!",
      data: error
    });    
  }


  
}

export {createHub, editHub, getHubs, getHubById, addProductToHub}