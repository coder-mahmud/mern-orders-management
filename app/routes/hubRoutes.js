import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getHubs, createHub, editHub } from '../controllers/hubController.js';
const hubRoutes = express();

// userRoutes.get("/",(req,res) => {
//   res.status(200).json({message:"user get route"})
// })

hubRoutes.get("/", getHubs)
hubRoutes.post("/", createHub)
hubRoutes.post("/edit", editHub)


export default hubRoutes