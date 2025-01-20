// import express from "express";
// import Message from "../models/message";
// import Matches from "./matches";
// import User from "../models/user";

// const router = express.Router();

// // Fetch messages between two users
// router.get("/:userId/:recipientId", async (req, res) => {
//   const { userId, recipientId } = req.params;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, recipient: recipientId },
//         { sender: recipientId, recipient: userId },
//       ],
//     }).sort("createdAt");

//     res.json({ messages });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Send a message
// router.post("/", async (req, res) => {
//   const { sender, recipient, content } = req.body;

//   if (!sender || !recipient || !content) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const message = new Message({ sender, recipient, content });
//     await message.save();

//     res.status(201).json({ message });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

