import express from "express";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    let chatUser;
    if (req.user.role === "admin") {
      chatUser = userId;
    } else {
      chatUser = req.user._id;
    }

    if (!chatUser) {
      return res.status(400).json({ message: "User missing" });
    }

    const chat = await Chat.create({
      user: chatUser,
      sender: req.user.role === "admin" ? "admin" : "user",
      text,
    });

    const io = req.app.get("io");
    io.to(chat.user.toString()).emit("receiveMessage", chat);

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Send failed" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    let chatUser;

    if (req.user.role === "admin") {
      chatUser = req.query.userId;
    } else {
      chatUser = req.user._id;
    }

    if (!chatUser) return res.json([]);

    const chats = await Chat.find({ user: chatUser }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

export default router;