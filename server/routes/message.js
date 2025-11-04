import express from "express";
import Message from "../models/message.js";
import User from "../models/user.js";

const router = express.Router();

// fetch messages between two users
router.get("/:userId/:recipientId", async (req, res) => {
  const { userId, recipientId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'preferred_name profile_pic')
    .populate('recipient', 'preferred_name profile_pic');

    res.json({ messages });
  } catch (error) {
    console.error("error fetching messages:", error);
    res.status(500).json({ message: "server error" });
  }
});

// send a message
router.post("/", async (req, res) => {
  const { sender, recipient, content } = req.body;

  if (!sender || !recipient || !content) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    const message = new Message({ sender, recipient, content });
    await message.save();

    // populate sender and recipient details before sending response
    await message.populate('sender', 'preferred_name profile_pic');
    await message.populate('recipient', 'preferred_name profile_pic');

    res.status(201).json({ message });
  } catch (error) {
    console.error("error sending message:", error);
    res.status(500).json({ message: "server error" });
  }
});

// mark messages as read
router.put("/read/:userId/:recipientId", async (req, res) => {
  const { userId, recipientId } = req.params;

  try {
    await Message.updateMany(
      { sender: recipientId, recipient: userId, read: false },
      { read: true }
    );

    res.json({ message: "messages marked as read" });
  } catch (error) {
    console.error("error marking messages as read:", error);
    res.status(500).json({ message: "server error" });
  }
});

export default router;

