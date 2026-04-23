import express from "express";
import {
  listUsers,
  verifyRecruiter,
  banUser,
  deleteJob,
  analytics,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", listUsers);
router.patch("/verify-recruiter/:id", verifyRecruiter);
router.patch("/ban-user/:id", banUser);
router.delete("/job/:id", deleteJob);
router.get("/analytics", analytics);

export default router;
