import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
    // thread key — always sorted so "a_b" === "b_a"
    thread: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

messageSchema.pre("validate", function (next) {
  const ids = [this.from.toString(), this.to.toString()].sort();
  this.thread = ids.join("_");
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
