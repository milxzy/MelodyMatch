import express from "express"
const router = express.Router();
import Waitlist from "../models/waitlistModel.js"

// 1. route to add a user to the waitlist
router.post('/add-to-waitlist', async (req, res) => {
  const { email } = req.body;
  
  // basic email validation
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // check if the email is already on the waitlist
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already on the waitlist' });
    }

    // create a new waitlist entry
    const newWaitlistEntry = new Waitlist({
      email,
    });

    await newWaitlistEntry.save();
    return res.status(200).json({ message: 'Successfully added to the waitlist' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. route to check the current status of a user on the waitlist
router.get('/check-status/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Waitlist.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found on the waitlist' });
    }
    return res.status(200).json({ status: user.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. admin route to approve or reject users
router.post('/approve-reject', async (req, res) => {
  const { email, action } = req.body; // 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const user = await Waitlist.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found on the waitlist' });
    }

    user.status = action === 'approve' ? 'approved' : 'rejected';
    await user.save();

    return res.status(200).json({ message: `User ${action}d successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
