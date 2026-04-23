import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const createApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");
  if (job.status !== "open")
    throw new ApiError(400, "This job is no longer accepting applications");

  let resumeUrl = req.body.resumeUrl;
  if (req.file) resumeUrl = `/uploads/${req.file.filename}`;
  if (!resumeUrl && req.user.resumeUrl) resumeUrl = req.user.resumeUrl;

  try {
    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      coverLetter,
      resumeUrl,
      statusHistory: [{ status: "applied", note: "Application submitted" }],
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    await Notification.create({
      user: job.recruiter,
      message: `New application received for "${job.title}"`,
      type: "application",
      link: `/applications/job/${jobId}`,
    });

    const populated = await Application.findById(application._id)
      .populate("job", "title location jobType")
      .populate("candidate", "name email avatarUrl");

    res.status(201).json({
      success: true,
      message: "Application submitted",
      data: populated,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(400, "You have already applied to this job");
    }
    throw err;
  }
});

export const myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: "job",
      select: "title location jobType status recruiter",
      populate: { path: "recruiter", select: "name company avatarUrl" },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
});

export const applicantsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const isOwner = job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Access denied");

  const applications = await Application.find({ job: jobId })
    .populate(
      "candidate",
      "name email avatarUrl skills experience resumeUrl location bio"
    )
    .populate("job", "title")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const allowed = ["applied", "under_review", "shortlisted", "waitlist", "rejected", "hired"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status");

  const application = await Application.findById(req.params.id).populate("job");
  if (!application) throw new ApiError(404, "Application not found");

  const isOwner =
    application.job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Access denied");

  application.status = status;
  application.statusHistory.push({ status, note });
  await application.save();

  await Notification.create({
    user: application.candidate,
    message: `Your application for "${application.job.title}" is now: ${status.replace(
      "_",
      " "
    )}`,
    type: "status_change",
    link: `/applications/my`,
  });

  const populated = await Application.findById(application._id)
    .populate("candidate", "name email avatarUrl")
    .populate("job", "title");

  res.json({
    success: true,
    message: "Status updated",
    data: populated,
  });
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, "Application not found");

  if (application.candidate.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  await application.deleteOne();
  await Job.findByIdAndUpdate(application.job, {
    $inc: { applicationsCount: -1 },
  });

  res.json({ success: true, message: "Application withdrawn" });
});
