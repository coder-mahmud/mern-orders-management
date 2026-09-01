import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getHubs, createHub, editHub, getHubById, addProductToHub, updateHubs } from '../controllers/hubController.js';
const hubRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })

hubRoutes.get("/",protect, getHubs)
hubRoutes.get("/:id",protect, getHubById)
hubRoutes.post("/",protect, createHub)
hubRoutes.post("/edit",protect, editHub)
hubRoutes.post("/:id/addproduct",protect, addProductToHub)

// hubRoutes.post('/update-hubs-type', updateHubs);

export default hubRoutes