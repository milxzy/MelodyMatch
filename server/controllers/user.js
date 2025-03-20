import User from "../models/user.js";
import asyncHandler from "express-async-handler"
import generateToken from '../utils/generateToken.js'
import logger from '../utils/logger.js'






export const createUser = async (req, res) => {
  
  
    const user = new User({
        display_name: req.body.display_name,
        spotify_id: req.body.spotify_id,
        country: req.body.country,
        email: req.body.email,
        followed_artists: req.body.followed_artists,
        artist_genres: req.body.artist_genres
        // profile_pic: req.body.profile
      });
      try {
        const newUser = await user.save();
        res.status(201).json(newUser);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};

export const getUser = async (req, res) => {
    try{
        const id = req.params.id    
        const user = await User.find({ name: id })
        if(user != null){
          res.json(user)
        } else {
          res.status(404).json({message: 'cannot find player'})
        }
       } catch (err) {
      logger.error('Error fetching user by name:', err)
       }
};






export const addUserInfo = async (req, res) => {
  let someData = JSON.stringify(req.body)
  let parsedData = JSON.parse(someData)

  const user = await User.findOneAndUpdate(
    {
      email: parsedData.form.beEmail
    }, {
    contact_info:parsedData.form.contactInfo,
    preferred_name:parsedData.form.preferredName,
    age:parsedData.form.age,
    gender:parsedData.form.gender,
    beEmail: parsedData.form.beEmail,
    password: parsedData.form.bePass,
    genres:parsedData.genreState,
    artists:parsedData.artistState,
    country:parsedData.profileState[0],
    email:parsedData.profileState[1],
    spotify_id:parsedData.profileState[2],
    spotify_display_name:parsedData.profileState[3],
    profile_pic:parsedData.profileState[4]
  }, {
    new: true
  })
  try {
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const addSpotifyData = async (req, res) => {
  const data = req.body.userInfo
  const country = data[0]
  const email = data[1]
  const spotifyId = data[2]
  const spotifyDisplayName = data[3]

  const user = new User({
    spotify_id: spotifyId,
    email: email,
    spotify_display_name:spotifyDisplayName,
    country:country
    
  }) 
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



export const addSpotifyArtists = async (req, res) => {
  const user = new User({
    user_info:req.body.userInfo
  }) 
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



export const databaseLookup = async (req, res) => {
  const searchTerm = req.query.keyword
  try {
    const existingUser = await User.findOne({ spotify_id: searchTerm })
    if(!existingUser) {
      res.json('not found')
    } else {
      res.json('found')
    }
  } catch (error) {
    logger.error('Database lookup error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const makeAUser = async (req, res) => {
  // res.send("hello from the 'test' url");
  req.session.username = req.body.username;
  res.end()
}

export const getSingleUser = async (req, res) => {
  const user = req.query.keyword
  try {
    const searchedUser = await User.findOne({ email: user})
    res.json({searchedUser})
  } catch (error) {
    logger.error('Error fetching single user:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


export const getUsers = async (req, res) => {
  const { userId, page = 1, limit = 20 } = req.query;  // add pagination params

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // get current user to compare against
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // find all users excluding the current user, already liked, and blocked users
    const excludedIds = [
      userId,
      ...(currentUser.likedUsers || []),
      ...(currentUser.blockedUsers || [])
    ];

    // Build query filter with gender preferences
    const query = {
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true } // Exclude soft-deleted users
    };

    // Apply gender filter if user has preferences
    if (currentUser.preferences?.interestedIn && currentUser.preferences.interestedIn.length > 0) {
      query.gender = { $in: currentUser.preferences.interestedIn };
    }

    // Apply age filter if user has preferences
    if (currentUser.preferences?.ageMin || currentUser.preferences?.ageMax) {
      const ageMin = currentUser.preferences.ageMin || 18;
      const ageMax = currentUser.preferences.ageMax || 99;
      // Age is stored as string, so we need to convert for comparison
      query.$expr = {
        $and: [
          { $gte: [{ $toInt: "$age" }, ageMin] },
          { $lte: [{ $toInt: "$age" }, ageMax] }
        ]
      };
    }

    const allUsers = await User.find(query).lean();

    // import matching algorithm
    const { sortUsersByCompatibility } = await import('../utils/matchingAlgorithm.js');

    // sort users by music compatibility
    const sortedUsers = sortUsersByCompatibility(currentUser, allUsers);

    // Apply pagination
    const paginatedUsers = sortedUsers.slice(skip, skip + limitNum);
    const totalUsers = sortedUsers.length;
    const totalPages = Math.ceil(totalUsers / limitNum);

    logger.info(`found ${sortedUsers.length} potential matches for user ${userId} (page ${pageNum}/${totalPages})`);

    res.json({ 
      users: paginatedUsers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    logger.error("error fetching users:", error);
    res.status(500).json({ error: "internal server error" });
  }
};




export const like = async (req, res) => {
  const likedUserId = req.body.likedUserId;
  const likingUserId = req.body.liker;

  try {
    const likingUser = await User.findById(likingUserId);
    if (!likingUser) {
      return res.status(404).json({ error: 'Liking user not found' });
    }
    likingUser.likedUsers.push(likedUserId);
    await likingUser.save();
    res.status(200).json({ message: 'User liked successfully' });
  } catch (error) {
    logger.error('Error liking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
export const registerUser = asyncHandler(async (req, res) => {
  const { loginName, email, pass } = req.body;
  const userExists = await User.findOne({email})
  if (userExists){
    res.status(400)
    throw new Error("User already exists")
  }

  const user = await User.create({
    loginName,
    email,
    password: pass,
    allowedAccess: true, // Auto-approve all new users
  })

  if(user) {
    res.status(201).json({
      _id:user._id,
      loginName:user.loginName,
      email:user.email,
      password:user.password,
      hasCompletedMigration: user.hasCompletedMigration || false,
      connectedPlatforms: user.connectedPlatforms || [],
      token:generateToken(user._id),
    })
  }
 


})

export const backendLogin = asyncHandler(async (req, res) => {
  const { email, pass } = req.body;

  // Validate input
  if (!email || !pass) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find user and explicitly select password field (it has select: false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if user has a password set (some users only use Spotify login)
  if (!user.password) {
    res.status(401);
    throw new Error("This account uses Spotify login. Please use 'Continue with Spotify'");
  }

  // Verify password
  const isPasswordMatch = await user.matchPassword(pass);

  if (isPasswordMatch) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      hasCompletedMigration: user.hasCompletedMigration,
      connectedPlatforms: user.connectedPlatforms || [],
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
})


export const getMatches = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId).populate('likedUsers').populate('likedBy')
    
    const matches = user.likedUsers.filter(likedUser => 
      likedUser.likedUsers.some(likedByUser => likedByUser.equals(userId))
    );
    
    // filter out the current user from the matches list
    const filteredMatches = matches.filter(match => !match._id.equals(userId));

    res.json({ matches: filteredMatches })
  } catch (error) {
    logger.error('Error fetching matches:', error)
    res.status(500).json({ message: 'server error' })
  }
}

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, name, age, gender, bio, profile_pic, preferred_name, preferences } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (profile_pic !== undefined) user.profile_pic = profile_pic;
    if (preferred_name !== undefined) user.preferred_name = preferred_name;
    
    // Update preferences if provided
    if (preferences !== undefined) {
      if (!user.preferences) user.preferences = {};
      if (preferences.interestedIn !== undefined) {
        user.preferences.interestedIn = preferences.interestedIn;
      }
      if (preferences.ageMin !== undefined) {
        user.preferences.ageMin = preferences.ageMin;
      }
      if (preferences.ageMax !== undefined) {
        user.preferences.ageMax = preferences.ageMax;
      }
      user.markModified('preferences'); // Mark as modified for nested object
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        age: updatedUser.age,
        gender: updatedUser.gender,
        bio: updatedUser.bio,
        profile_pic: updatedUser.profile_pic,
        preferred_name: updatedUser.preferred_name,
      }
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500);
    throw new Error('Failed to update profile');
  }
});



// search for user
// if user is found, return found
// if user is not found return notfound