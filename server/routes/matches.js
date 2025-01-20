// import express from "express"
// import User from "../models/user"

// const router = express.Router();

// // Fetch matches for a user
// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId).populate("likedUsers").populate("likedBy");

//     const matches = user.likedUsers.filter((likedUser) =>
//       likedUser.likedBy.some((likedByUser) => likedByUser.equals(userId))
//     );

//     // Remove the current user from the matches
//     const filteredMatches = matches.filter((match) => !match._id.equals(userId));

//     res.json({ matches: filteredMatches });
//   } catch (error) {
//     console.error("Error fetching matches:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
