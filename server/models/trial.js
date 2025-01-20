import mongoose from 'mongoose';

const trialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
 position: {
    type: String,
    required: false
  },
  level: {
    type: String,
    required: false
  },
})

const model = mongoose.model('Trial', trialSchema)

export const schema = model.schema;
export default model;