import express from 'express'
import { getOrders, createOrder, editOrder, deleteOrder, getHubOrder } from '../controllers/orderController.js'

const orderRoutes = express();

orderRoutes.get("/", getOrders);
orderRoutes.post("/create", createOrder);
orderRoutes.post("/edit", editOrder);
orderRoutes.post("/delete", deleteOrder);
orderRoutes.get("/hub/:id/:date", getHubOrder);

export default orderRoutes;