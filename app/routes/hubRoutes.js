import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getHubs, createHub, editHub, getHubById, addProductToHub, updateHubs } from '../controllers/hubController.js';
const hubRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })

hubRoutes.get("/", getHubs)
hubRoutes.get("/:id", getHubById)
hubRoutes.post("/", createHub)
hubRoutes.post("/edit", editHub)
hubRoutes.post("/:id/addproduct", addProductToHub)

// hubRoutes.post('/update-hubs-type', updateHubs);

export default hubRoutes