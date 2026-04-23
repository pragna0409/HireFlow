import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getThreads,
  getConversation,
  sendMessage,
  unreadCount,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protect);

router.get("/threads", getThreads);
router.get("/unread/count", unreadCount);
router.get("/:userId", getConversation);
router.post("/", sendMessage);

export default router;
