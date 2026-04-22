import express from "express";
import {
  getPublicProfile,
  updateUser,
  listUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), listUsers);
router.get("/:id", getPublicProfile);
router.put("/:id", protect, updateUser);

export default router;
