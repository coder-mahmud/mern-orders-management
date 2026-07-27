import express from 'express'
import { getOrders, createOrder, editOrder, deleteOrder, getHubOrder,getOrderById,changeOrderStatus, getOrderByDate, changeVerifyStatus, searchOrders, changeRiderDeliveryStatus } from '../controllers/orderController.js'
import protect from '../middlewares/authMiddleware.js';

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
orderRoutes.post("/rider-status",protect, changeRiderDeliveryStatus);

export default orderRoutes;