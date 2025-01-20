import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const model = mongoose.model('Match', matchSchema)

export const schema = model.schema;
export default model;