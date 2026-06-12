import express from "express";
import {
  createRiderInput,
  getMyRiderInputByDate,
  getAllRiderInputsByDate,
  updateRiderInputByAdmin,
  createOrUpdateRiderInputByAdmin,
  getRiderInputByRiderAndDateForAdmin,
} from "../controllers/riderInputController.js";

import protect, { authorizeRoles } from "../middlewares/authMiddleware.js";

const riderInputRouter = express.Router();

// Rider creates own delivery input
// POST /api/rider-inputs
// Admin/controller gets all rider inputs by date
// GET /api/rider-inputs?date=2026-04-30
riderInputRouter
  .route("/")
  .post(protect, authorizeRoles("rider"), createRiderInput)
  .get(
    protect,
    authorizeRoles("admin", "superAdmin", "controller"),
    getAllRiderInputsByDate
  );

// Rider gets own input by date
// GET /api/rider-inputs/my?date=2026-04-30
riderInputRouter.get(
  "/my",
  protect,
  authorizeRoles("rider"),
  getMyRiderInputByDate
);

// Admin/controller gets one selected rider's input by date
// GET /api/rider-inputs/admin-entry?riderId=USER_ID&date=2026-04-30
riderInputRouter.get(
  "/admin-entry",
  protect,
  authorizeRoles("admin", "superAdmin", "controller"),
  getRiderInputByRiderAndDateForAdmin
);

// Admin/controller creates or updates selected rider's delivery input
// POST /api/rider-inputs/admin-entry
riderInputRouter.post(
  "/admin-entry",
  protect,
  authorizeRoles("admin", "superAdmin",),
  createOrUpdateRiderInputByAdmin
);

// Admin updates rider input by input document ID
// PUT /api/rider-inputs/:id
riderInputRouter.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  updateRiderInputByAdmin
);

export default riderInputRouter;