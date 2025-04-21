import express from 'express'
import protect from '../middlewares/authMiddleware.js'
// import { getHubs, createHub, editHub, getHubById, addProductToHub } from '../controllers/hubController.js';
import { createHubStock, editHubStock, getHubStock, createStockforHub, } from '../controllers/hutStockController.js';
const hubStockRoutes = express();


hubStockRoutes.get("/gethubstock/:hubId", getHubStock)
hubStockRoutes.post("/create", createHubStock)
hubStockRoutes.post("/createforHub", createStockforHub)
hubStockRoutes.post("/edit", editHubStock)


export default hubStockRoutes