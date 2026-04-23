import express from "express";
import {
  getPublicProfile,
  updateUser,
  listUsers,
  addResume,
  deleteResume,
  getResumes,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), listUsers);
router.get("/:id", getPublicProfile);
router.put("/:id", protect, updateUser);

// Resume library
router.get("/me/resumes", protect, authorizeRoles("candidate"), getResumes);
router.post("/me/resumes", protect, authorizeRoles("candidate"), upload.single("resume"), addResume);
router.delete("/me/resumes/:resumeId", protect, authorizeRoles("candidate"), deleteResume);

export default router;
