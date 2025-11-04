import User from "../models/user.js";
import Trial from "../models/trial.js";
// import matches from "../../client/src/components/matches.jsx";
import { match } from "assert";
import Match from "../models/matches.js"
import asyncHandler from "express-async-handler" 
import generateToken from '../utils/generateToken.js'






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
      console.error(err)
       }
};






export const displayDashboard = async (req, res) => {
  const response = await fetch("https:// api.spotify.com/v1/me", {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token,
    },
  });
  const data = await response.json();
  console.log(data);

  const artistGenres = await fetch(
    "https:// api.spotify.com/v1/me/following?type=artist",
    {
      method: "get",
      headers: {
        Authorization: "Bearer " + global.access_token,
      },
    }
  );

  const artistData = await artistGenres.json();

  const allGenres = [];

  artistData.artists.items.forEach((artist) => {
    if (artist.genres && artist.genres.length > 0) {
      allGenres.push(...artist.genres);
    }
  });

  const artistNames = [];
  artistData.artists.items.forEach((artist) => {
    artistNames.push(artist.name);
  });

  res.render("dashboard", { user: data });
  console.log(artistData.artists.items);
  console.log(allGenres);
  console.log(artistNames);
};

export const callback = async (req, res) => {
  console.log('callback')
    const code = req.query.code;
    let body = new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
  
    })
    const response = await fetch('https:// accounts.spotify.com/api/token', {
      method: "post",
      body: body,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: 
        "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
      }
    })
     const data = await response.json()
     const userFromDB = await User.findOne({ email: data.email });
     if (!userFromDB) {
      // handle case where user is not found in mongodb
      return res.status(404).send('User not found');
    }
    req.user = { id: userFromDB._id };
    global.access_token = data.access_token;
   
  res.redirect('/dashboard')
}

export const addUserInfo = async (req, res) => {

console.log('added user info: ' + req.body)
let someData = JSON.stringify(req.body)
let parsedData = JSON.parse(someData)
console.log(parsedData)
console.log(parsedData.form.beEmail)

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
  console.log('user about to save')
  console.log('saved user info: ', user)
  res.status(201).json(user)
} catch (err) {
  res.status(400).json({ message: err.message });
}
}

export const addSpotifyData = async (req, res) => {
  console.log(req.body.userInfo)
  const data = req.body.userInfo
  const country = data[0]
  const email = data[1]
  const spotifyId = data[2]
  const spotifyDisplayName = data[3]
  console.log(data[0])

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
  console.log(req.body)
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


console.log('backend working')
const searchTerm = req.query.keyword
try {
  const existingUser = await User.findOne({ spotify_id: searchTerm })
  if(!existingUser) {
    console.log('not found')
    res.json('not found')
  } else {
    res.json('found')
  }
} catch {
  console.error(error)
}

}

export const makeAUser = async (req, res) => {
  // res.send("hello from the 'test' url");
  req.session.username = req.body.username;
  res.end()
}

export const getSingleUser = async (req, res) => {
  const user = req.query.keyword
  console.log(`backend working for ${user}`)
    try {
      const searchedUser = await User.findOne({ email: user})
      console.log('searched user: ',searchedUser)
      res.json({searchedUser})
      if(!user) {
        console.log('error')
      }
    } catch {
      console.error(req.error)
    }
  
}


export const getUsers = async (req, res) => {
  const { userId } = req.query;  // get userid from query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // get current user to compare against
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // find all users excluding the current user and those already liked
    const allUsers = await User.find({
      _id: {
        $ne: userId,
        $nin: currentUser.likedUsers || []
      }
    });

    // import matching algorithm
    const { sortUsersByCompatibility } = await import('../utils/matchingAlgorithm.js');

    // sort users by music compatibility
    const sortedUsers = sortUsersByCompatibility(currentUser, allUsers);

    console.log(`found ${sortedUsers.length} potential matches for user ${userId}`);
    res.json({ users: sortedUsers });
  } catch (error) {
    console.error("error fetching users:", error);
    res.status(500).json({ error: "internal server error" });
  }
};




export const like = async (req, res) => {
  const likedUserId = req.body.likedUserId;
   const likingUserId = req.body.liker;
  console.log(`${likingUserId} likes ${likedUserId}`)

// add db functionality

try {
const likingUser = await User.findById(likingUserId);
if (!likingUser) {
  return res.status(404).json({ error: 'Liking user not found' });
}
 // add the liked user to the likedusers array
 likingUser.likedUsers.push(likedUserId);

 // save the changes
 await likingUser.save();
 console.log(likingUser.likedUsers)

 res.status(200).json({ message: 'User liked successfully' });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}

}
export const registerUser = asyncHandler(async (req, res) => {
  console.log('42')
  const { loginName, email, pass, allowedAccess} = req.body;
  console.log(req.body)
  const userExists = await User.findOne({email})
  if (userExists){
    res.status(400)
    throw new Error("User already exists")
  }

  const user = await User.create({
    loginName, email,
    password: pass,
    allowedAccess: allowedAccess,
  })
  console.log(user)

  if(user) {
    res.status(201).json({
      _id:user._id,
      loginName:user.loginName,
      email:user.email,
      password:user.password,
      token:generateToken(user._id),
    })
  }
 


})

export const backendLogin = asyncHandler(async (req, res) => {
  console.log('42')
  const { name, email, pass, pic } = req.body;
  console.log(req.body)
  const user = await User.findOne({email})
  console.log(user)

  if (user && (await user.matchPassword(pass))){
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      pass:user.pass,
      pic:user.pic,
      token:generateToken(user._id),
    })
  } else{
    res.status(400)
    throw new Error("Invalid email or password")
  }
})


export const getMatches = async (req, res) => {
  console.log('getting user connected')
  const { userId } = req.params
  console.log(userId) 
  try {
    const user = await User.findById(userId).populate('likedUsers').populate('likedBy')
    
    const matches = user.likedUsers.filter(likedUser => 
      likedUser.likedUsers.some(likedByUser => likedByUser.equals(userId))
    );
    
    // filter out the current user from the matches list
    const filteredMatches = matches.filter(match => !match._id.equals(userId));

    console.log(filteredMatches)
    res.json({ matches: filteredMatches })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'server error' })
  }
}



// search for user
// if user is found, return found
// if user is not found return notfound