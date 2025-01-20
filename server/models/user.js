import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  contact_info: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  preferred_name: {
    type: String,
    required: false
  },
  spotify_display_name: {
    type:String,
    required: false
  },
  spotify_id: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
  },
  artists: {
    type:Array,
    required: false
  },
  genres: {
    type: Array,
    required: false
  },
  preferred_name: {
    type: String,
    required: false
  },
  age: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  suggested_matches: {
    type: String,
    required: false
  },
  profile_pic: {
    type: String,
    required: false
  },
  likes: {
    type: String,
    required: false
  },
  db_username: {
    type: String,
    required: false
  },
  db_password: {
    type: String,
    required: false
  },
  new_name: {
    type: String,
    required: false
  },
  loginName: {
    type : String,
    require: false
  },
  pass: {
    type: String,
    require: false
  },
  beEmail: {
    type: String,
    required: false
  },
  pic: {
    type: String,
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  },
  likedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likedBy: [{  // Define the likedBy field
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const model = mongoose.model('User', userSchema)

export const schema = model.schema;
export default model;
