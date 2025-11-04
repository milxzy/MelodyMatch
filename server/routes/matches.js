import express from "express"
import User from "../models/user.js"

const router = express.Router();

// fetch matches for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("likedUsers").populate("likedBy");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const matches = user.likedUsers.filter((likedUser) =>
      likedUser.likedBy.some((likedByUser) => likedByUser.equals(userId))
    );

    // remove the current user from the matches
    const filteredMatches = matches.filter((match) => !match._id.equals(userId));

    res.json({ matches: filteredMatches });
  } catch (error) {
    console.error("error fetching matches:", error);
    res.status(500).json({ message: "server error" });
  }
});

export default router;
