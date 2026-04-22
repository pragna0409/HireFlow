import express from "express";
import { body } from "express-validator";
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleStatus,
  toggleSaveJob,
  myPostedJobs,
  mySavedJobs,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", listJobs);

router.get("/my/posted", protect, authorizeRoles("recruiter", "admin"), myPostedJobs);
router.get("/my/saved", protect, authorizeRoles("candidate"), mySavedJobs);

router.post(
  "/",
  protect,
  authorizeRoles("recruiter", "admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("jobType")
      .optional()
      .isIn(["full-time", "part-time", "internship", "contract"]),
    body("experienceLevel")
      .optional()
      .isIn(["entry", "mid", "senior", "lead"]),
  ],
  validate,
  createJob
);

router.get("/:id", getJob);
router.put("/:id", protect, authorizeRoles("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter", "admin"), deleteJob);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  toggleStatus
);
router.post("/:id/save", protect, authorizeRoles("candidate"), toggleSaveJob);

export default router;
