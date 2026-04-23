import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company, skills, experience } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(400, "Email already registered");

  const assignedRole = role === "recruiter" ? "recruiter" : "candidate";

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    company: assignedRole === "recruiter" ? company : undefined,
    skills: skills || [],
    experience: experience || 0,
    isApproved: true, // all users active immediately; admin can verify recruiters separately
  });

  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        isApproved: user.isApproved,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (user.isBanned) throw new ApiError(403, "Your account is banned");

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);

  res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        avatarUrl: user.avatarUrl,
        isApproved: user.isApproved,
      },
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "savedJobs",
    "title company location jobType"
  );
  res.json({ success: true, data: user });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ success: true, message: "Logged out" });
});

export const updateProfile = asyncHandler(async (req, res) => {
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

  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    if (req.file.mimetype.startsWith("image/")) updates.avatarUrl = fileUrl;
    else updates.resumeUrl = fileUrl;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Profile updated",
    data: user,
  });
});
