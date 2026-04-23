import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    skills: [{ type: String, trim: true }],
    experience: { type: Number, default: 0 },
    resumeUrl: { type: String },
    resumes: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    avatarUrl: { type: String },
    bio: { type: String },
    location: { type: String },
    company: { type: String },
    isApproved: { type: Boolean, default: true },  // legacy — always true, no approval gate
    isVerified: { type: Boolean, default: false },  // admin-granted verified badge
    isBanned: { type: Boolean, default: false },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
