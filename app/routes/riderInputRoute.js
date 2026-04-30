import express from "express";
import {
  createOrUpdateRiderInput,
  getMyRiderInputByDate,
  getAllRiderInputsByDate,
} from "../controllers/riderInputController.js";
import protect,{authorizeRoles} from "../middlewares/authMiddleware.js";

const riderInputRouter = express.Router();

riderInputRouter
  .route("/")
  .post(protect, authorizeRoles("rider"), createOrUpdateRiderInput)
  .get(
    protect,
    authorizeRoles("admin", "superAdmin", "controller"),
    getAllRiderInputsByDate
  );

riderInputRouter.get(
  "/my",
  protect,
  authorizeRoles("rider"),
  getMyRiderInputByDate
);

export default riderInputRouter;