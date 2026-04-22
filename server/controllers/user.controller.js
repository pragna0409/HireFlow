import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -savedJobs -isBanned"
  );
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isSelf = req.user._id.toString() === id;
  const isAdmin = req.user.role === "admin";

  if (!isSelf && !isAdmin) throw new ApiError(403, "Access denied");

  const allowed = [
    "name",
    "skills",
    "experience",
    "resumeUrl",
    "avatarUrl",
    "bio",
    "location",
    "company",
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (isAdmin) {
    if (req.body.role) updates.role = req.body.role;
    if (req.body.isApproved !== undefined)
      updates.isApproved = req.body.isApproved;
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, "User not found");

  res.json({ success: true, message: "User updated", data: user });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
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
