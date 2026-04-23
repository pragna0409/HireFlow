import Job from "../models/Job.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const listJobs = asyncHandler(async (req, res) => {
  const {
    search,
    location,
    jobType,
    experienceLevel,
    skills,
    minSalary,
    status,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  else filter.status = "open";

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (location) filter.location = { $regex: location, $options: "i" };
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (skills) {
    const arr = Array.isArray(skills) ? skills : skills.split(",");
    filter.skillsRequired = {
      $in: arr.map((s) => new RegExp(`^${s.trim()}$`, "i")),
    };
  }
  if (minSalary) {
    filter["salaryRange.max"] = { $gte: Number(minSalary) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("recruiter", "name company avatarUrl isVerified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("recruiter", "name company avatarUrl email bio location isVerified");

  if (!job) throw new ApiError(404, "Job not found");

  res.json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  if (req.user.role === "recruiter" && !req.user.isApproved) {
    throw new ApiError(403, "Recruiter account not yet approved");
  }

  const payload = {
    ...req.body,
    recruiter: req.user._id,
  };

  const job = await Job.create(payload);
  res.status(201).json({
    success: true,
    message: "Job created",
    data: job,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");

  const isOwner = job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Access denied");

  const allowed = [
    "title",
    "description",
    "skillsRequired",
    "salaryRange",
    "location",
    "jobType",
    "experienceLevel",
    "status",
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) job[key] = req.body[key];
  }

  await job.save();
  res.json({ success: true, message: "Job updated", data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");

  const isOwner = job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Access denied");

  await job.deleteOne();
  res.json({ success: true, message: "Job deleted" });
});

export const toggleStatus = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");

  const isOwner = job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Access denied");

  job.status = job.status === "open" ? "closed" : "open";
  await job.save();

  res.json({
    success: true,
    message: `Job marked as ${job.status}`,
    data: job,
  });
});

export const toggleSaveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const user = await User.findById(req.user._id);
  const index = user.savedJobs.findIndex((j) => j.toString() === jobId);

  let saved;
  if (index >= 0) {
    user.savedJobs.splice(index, 1);
    saved = false;
  } else {
    user.savedJobs.push(jobId);
    saved = true;
  }

  await user.save();
  res.json({
    success: true,
    message: saved ? "Job saved" : "Job unsaved",
    data: { saved, savedJobs: user.savedJobs },
  });
});

export const myPostedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .sort({ createdAt: -1 })
    .populate("recruiter", "name company avatarUrl isVerified");
  res.json({ success: true, data: jobs });
});

export const mySavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    populate: { path: "recruiter", select: "name company avatarUrl isVerified" },
  });
  res.json({ success: true, data: user.savedJobs });
});
