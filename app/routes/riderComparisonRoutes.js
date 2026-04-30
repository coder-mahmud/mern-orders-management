import express from "express";
import protect,{ authorizeRoles } from "../middlewares/authMiddleware.js";
import { getAllRiderProductComparisonByDate } from "../controllers/riderComparisonController.js";

const riderComparisonRouter = express.Router();

riderComparisonRouter.get(
  "/:date",
  protect,
  authorizeRoles("admin", "superAdmin", "staff"),
  getAllRiderProductComparisonByDate
);

export default riderComparisonRouter;