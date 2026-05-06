import express from "express";
import {
  // createOrUpdateRiderInput,
  createRiderInput,
  getMyRiderInputByDate,
  getAllRiderInputsByDate,
  updateRiderInputByAdmin,
} from "../controllers/riderInputController.js";
import protect,{authorizeRoles} from "../middlewares/authMiddleware.js";

const riderInputRouter = express.Router();

riderInputRouter
  .route("/")
  .post(protect, authorizeRoles("rider"), createRiderInput)
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

riderInputRouter.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  updateRiderInputByAdmin
);



export default riderInputRouter;