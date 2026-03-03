import express from 'express'
import { getOrders, createOrder, editOrder, deleteOrder, getHubOrder,getOrderById,changeOrderStatus, getOrderByDate, changeVerifyStatus, searchOrders } from '../controllers/orderController.js'

const orderRoutes = express();

orderRoutes.get("/", getOrders);
orderRoutes.post("/create", createOrder);
orderRoutes.post("/edit", editOrder);
orderRoutes.post("/delete", deleteOrder);
orderRoutes.post("/status", changeOrderStatus);
orderRoutes.post("/verify", changeVerifyStatus);
orderRoutes.get("/search", searchOrders);
orderRoutes.get("/hub/:id/:date", getHubOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.get("/date/:date", getOrderByDate);

export default orderRoutes;