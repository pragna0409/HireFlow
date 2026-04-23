import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import Notification from "./models/Notification.js";

const run = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log("Creating users...");

    const admin = await User.create({
      name: "Admin",
      email: "admin@hireflow.com",
      password: "Admin@123",
      role: "admin",
      isApproved: true,
    });

    const recruiter1 = await User.create({
      name: "Ava Recruiter",
      email: "recruiter1@hireflow.com",
      password: "Recruiter@123",
      role: "recruiter",
      company: "TechNova Inc.",
      location: "Bangalore, India",
      bio: "Hiring for engineering roles at TechNova.",
      isApproved: true,
      isVerified: true,
    });

    const recruiter2 = await User.create({
      name: "Ben Hiring",
      email: "recruiter2@hireflow.com",
      password: "Recruiter@123",
      role: "recruiter",
      company: "CloudPeak Labs",
      location: "Remote",
      bio: "Leading talent acquisition at CloudPeak.",
      isApproved: true,
      isVerified: true,
    });

    const candidate1 = await User.create({
      name: "Priya Sharma",
      email: "candidate1@hireflow.com",
      password: "Candidate@123",
      role: "candidate",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      experience: 2,
      location: "Bangalore, India",
      bio: "Full-stack developer passionate about clean code.",
    });

    const candidate2 = await User.create({
      name: "Rahul Verma",
      email: "candidate2@hireflow.com",
      password: "Candidate@123",
      role: "candidate",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      experience: 4,
      location: "Pune, India",
      bio: "Backend engineer with cloud experience.",
    });

    const candidate3 = await User.create({
      name: "Meera Iyer",
      email: "candidate3@hireflow.com",
      password: "Candidate@123",
      role: "candidate",
      skills: ["Figma", "UI/UX", "CSS", "Tailwind"],
      experience: 1,
      location: "Chennai, India",
      bio: "Designer transitioning into frontend engineering.",
    });

    console.log("Creating jobs...");

    const jobsPayload = [
      {
        title: "Senior Frontend Engineer",
        description:
          "Build world-class UI experiences using React and TypeScript. Collaborate with designers and backend engineers.",
        recruiter: recruiter1._id,
        skillsRequired: ["React", "TypeScript", "CSS", "JavaScript"],
        salaryRange: { min: 1800000, max: 3000000 },
        location: "Bangalore, India",
        jobType: "full-time",
        experienceLevel: "senior",
      },
      {
        title: "Backend Developer (Node.js)",
        description:
          "Design and build scalable REST and GraphQL APIs on Node.js and MongoDB.",
        recruiter: recruiter1._id,
        skillsRequired: ["Node.js", "Express", "MongoDB", "Redis"],
        salaryRange: { min: 1200000, max: 2200000 },
        location: "Remote",
        jobType: "full-time",
        experienceLevel: "mid",
      },
      {
        title: "Frontend Intern",
        description:
          "Internship opportunity for students passionate about React and modern web UI.",
        recruiter: recruiter1._id,
        skillsRequired: ["HTML", "CSS", "JavaScript", "React"],
        salaryRange: { min: 20000, max: 40000 },
        location: "Bangalore, India",
        jobType: "internship",
        experienceLevel: "entry",
      },
      {
        title: "DevOps Engineer",
        description:
          "Own CI/CD, Kubernetes clusters, and infrastructure-as-code at CloudPeak Labs.",
        recruiter: recruiter2._id,
        skillsRequired: ["Kubernetes", "AWS", "Terraform", "Docker"],
        salaryRange: { min: 2000000, max: 3500000 },
        location: "Remote",
        jobType: "full-time",
        experienceLevel: "senior",
      },
      {
        title: "Data Scientist",
        description:
          "Build ML pipelines and explore large datasets to drive business insights.",
        recruiter: recruiter2._id,
        skillsRequired: ["Python", "PyTorch", "SQL", "Pandas"],
        salaryRange: { min: 1500000, max: 2800000 },
        location: "Hyderabad, India",
        jobType: "full-time",
        experienceLevel: "mid",
      },
      {
        title: "Product Designer (Contract)",
        description:
          "Short-term contract to redesign our flagship dashboard end-to-end.",
        recruiter: recruiter2._id,
        skillsRequired: ["Figma", "UI/UX", "Prototyping"],
        salaryRange: { min: 80000, max: 150000 },
        location: "Remote",
        jobType: "contract",
        experienceLevel: "mid",
      },
      {
        title: "Full-Stack Engineer (MERN)",
        description:
          "Own features end-to-end across React, Node.js and MongoDB in a fast-moving startup.",
        recruiter: recruiter1._id,
        skillsRequired: ["React", "Node.js", "MongoDB", "Express"],
        salaryRange: { min: 1000000, max: 1800000 },
        location: "Bangalore, India",
        jobType: "full-time",
        experienceLevel: "mid",
      },
      {
        title: "QA Automation Engineer (Part-time)",
        description:
          "Help build our end-to-end automation suite with Playwright and Cypress.",
        recruiter: recruiter2._id,
        skillsRequired: ["Playwright", "Cypress", "JavaScript"],
        salaryRange: { min: 600000, max: 1000000 },
        location: "Remote",
        jobType: "part-time",
        experienceLevel: "mid",
      },
    ];

    const jobs = await Job.insertMany(jobsPayload);

    console.log("Creating applications...");

    const applicationsPayload = [
      {
        candidate: candidate1._id,
        job: jobs[0]._id,
        status: "shortlisted",
        coverLetter: "I built several React + TS projects and would love to contribute.",
        statusHistory: [
          { status: "applied", note: "Application submitted" },
          { status: "under_review", note: "Resume reviewed" },
          { status: "shortlisted", note: "Invited for interview" },
        ],
      },
      {
        candidate: candidate1._id,
        job: jobs[6]._id,
        status: "applied",
        coverLetter: "MERN stack is my strongest area.",
        statusHistory: [{ status: "applied", note: "Application submitted" }],
      },
      {
        candidate: candidate2._id,
        job: jobs[4]._id,
        status: "under_review",
        coverLetter: "Experienced with Python and data pipelines in AWS.",
        statusHistory: [
          { status: "applied", note: "Application submitted" },
          { status: "under_review", note: "Screening in progress" },
        ],
      },
      {
        candidate: candidate2._id,
        job: jobs[3]._id,
        status: "hired",
        coverLetter: "Extensive DevOps background with Terraform and EKS.",
        statusHistory: [
          { status: "applied", note: "Application submitted" },
          { status: "under_review", note: "Screening done" },
          { status: "shortlisted", note: "Panel interview scheduled" },
          { status: "hired", note: "Offer accepted" },
        ],
      },
      {
        candidate: candidate3._id,
        job: jobs[5]._id,
        status: "rejected",
        coverLetter: "Designer with 1 year experience, familiar with Figma.",
        statusHistory: [
          { status: "applied", note: "Application submitted" },
          { status: "rejected", note: "Seeking more senior candidates" },
        ],
      },
      {
        candidate: candidate3._id,
        job: jobs[2]._id,
        status: "applied",
        coverLetter: "Transitioning from design to frontend, eager to learn.",
        statusHistory: [{ status: "applied", note: "Application submitted" }],
      },
    ];

    const applications = await Application.insertMany(applicationsPayload);

    for (const app of applications) {
      await Job.findByIdAndUpdate(app.job, {
        $inc: { applicationsCount: 1 },
      });
    }

    console.log("Creating notifications...");

    await Notification.insertMany([
      {
        user: recruiter1._id,
        message: `New application received for "${jobs[0].title}"`,
        type: "application",
        link: `/applications/job/${jobs[0]._id}`,
      },
      {
        user: candidate1._id,
        message: `Your application for "${jobs[0].title}" is now: shortlisted`,
        type: "status_change",
        link: `/applications/my`,
      },
      {
        user: candidate2._id,
        message: `Your application for "${jobs[3].title}" is now: hired`,
        type: "status_change",
        link: `/applications/my`,
      },
      {
        user: candidate3._id,
        message: `Your application for "${jobs[5].title}" is now: rejected`,
        type: "status_change",
        link: `/applications/my`,
      },
    ]);

    console.log("\n=== Seed complete ===");
    console.log("Admin:      admin@hireflow.com / Admin@123");
    console.log("Recruiter1: recruiter1@hireflow.com / Recruiter@123");
    console.log("Recruiter2: recruiter2@hireflow.com / Recruiter@123");
    console.log("Candidate1: candidate1@hireflow.com / Candidate@123");
    console.log("Candidate2: candidate2@hireflow.com / Candidate@123");
    console.log("Candidate3: candidate3@hireflow.com / Candidate@123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

run();
