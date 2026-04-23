import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { role, isApproved, isBanned, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (isBanned !== undefined) filter.isBanned = isBanned === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const verifyRecruiter = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== "recruiter")
    throw new ApiError(400, "User is not a recruiter");

  user.isVerified = !user.isVerified;
  await user.save();
  res.json({
    success: true,
    message: user.isVerified ? "Recruiter verified" : "Verification removed",
    data: user,
  });
});

export const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "admin") throw new ApiError(400, "Cannot ban an admin");

  user.isBanned = !user.isBanned;
  await user.save();
  res.json({
    success: true,
    message: user.isBanned ? "User banned" : "User unbanned",
    data: user,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  await Application.deleteMany({ job: job._id });
  res.json({ success: true, message: "Job and its applications deleted" });
});

export const analytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalJobs,
    totalApplications,
    applicationsByStatusRaw,
    usersByRoleRaw,
    jobsPerMonthRaw,
  ] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Job.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const applicationsByStatus = applicationsByStatusRaw.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const usersByRole = usersByRoleRaw.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const jobsPerMonth = jobsPerMonthRaw.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    count: item.count,
  }));

  res.json({
    success: true,
    data: {
      totalUsers,
      totalJobs,
      totalApplications,
      applicationsByStatus,
      jobsPerMonth,
      usersByRole,
    },
  });
});
