import Message from "../models/Message.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/** GET /messages/threads — list all unique conversation partners */
export const getThreads = asyncHandler(async (req, res) => {
  const uid = req.user._id.toString();

  // Find all messages involving this user
  const msgs = await Message.find({
    $or: [{ from: req.user._id }, { to: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("from", "name avatarUrl role")
    .populate("to", "name avatarUrl role");

  // Build thread map: partnerId -> { partner, lastMsg, unread }
  const threadMap = new Map();
  for (const m of msgs) {
    const partner = m.from._id.toString() === uid ? m.to : m.from;
    const pid = partner._id.toString();
    if (!threadMap.has(pid)) {
      threadMap.set(pid, {
        partner,
        lastMessage: m.body,
        lastAt: m.createdAt,
        unread: 0,
      });
    }
    if (!m.read && m.to._id.toString() === uid) {
      threadMap.get(pid).unread++;
    }
  }

  res.json({ success: true, data: Array.from(threadMap.values()) });
});

/** GET /messages/:userId — get full conversation with a user */
export const getConversation = asyncHandler(async (req, res) => {
  const other = req.params.userId;
  const me = req.user._id;

  const messages = await Message.find({
    $or: [
      { from: me, to: other },
      { from: other, to: me },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("from", "name avatarUrl role")
    .populate("to", "name avatarUrl role");

  // Mark incoming as read
  await Message.updateMany(
    { from: other, to: me, read: false },
    { $set: { read: true } }
  );

  res.json({ success: true, data: messages });
});

/** POST /messages — send a message */
export const sendMessage = asyncHandler(async (req, res) => {
  const { toUserId, body } = req.body;
  if (!toUserId || !body?.trim()) throw new ApiError(400, "toUserId and body are required");

  const recipient = await User.findById(toUserId);
  if (!recipient) throw new ApiError(404, "Recipient not found");

  const msg = await Message.create({
    from: req.user._id,
    to: toUserId,
    body: body.trim(),
  });

  const populated = await Message.findById(msg._id)
    .populate("from", "name avatarUrl role")
    .populate("to", "name avatarUrl role");

  res.status(201).json({ success: true, data: populated });
});

/** GET /messages/unread/count */
export const unreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({ to: req.user._id, read: false });
  res.json({ success: true, data: { count } });
});
