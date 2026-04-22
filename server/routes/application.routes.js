import express from "express";
import { body } from "express-validator";
import {
  createApplication,
  myApplications,
  applicantsForJob,
  updateStatus,
  withdrawApplication,
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  [body("jobId").notEmpty().withMessage("jobId is required")],
  validate,
  createApplication
);

router.get("/my", protect, authorizeRoles("candidate"), myApplications);

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  applicantsForJob
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  [
    body("status")
      .isIn(["applied", "under_review", "shortlisted", "rejected", "hired"])
      .withMessage("Invalid status"),
  ],
  validate,
  updateStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("candidate"),
  withdrawApplication
);

export default router;
