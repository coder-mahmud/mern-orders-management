import express from 'express'
import { getOrders, createOrder, editOrder, deleteOrder, getHubOrder,getOrderById,changeOrderStatus, getOrderByDate, changeVerifyStatus, searchOrders, changeRiderDeliveryStatus } from '../controllers/orderController.js'
import protect from '../middlewares/authMiddleware.js';

const orderRoutes = express();

orderRoutes.get("/",protect, getOrders);
orderRoutes.post("/create",protect, createOrder);
orderRoutes.post("/edit",protect, editOrder);
orderRoutes.post("/delete",protect, deleteOrder);
orderRoutes.post("/status",protect, changeOrderStatus);
orderRoutes.post("/verify",protect, changeVerifyStatus);
orderRoutes.get("/search",protect, searchOrders);
orderRoutes.get("/hub/:id/:date",protect, getHubOrder);
orderRoutes.get("/:id",protect, getOrderById);
orderRoutes.get("/date/:date",protect, getOrderByDate);
orderRoutes.post("/rider-status",protect, changeRiderDeliveryStatus);

export default orderRoutes;