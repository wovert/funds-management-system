import mongoose from 'mongoose'

const Schema = mongoose.Schema

// create schema
const ProfileSchema = new Schema({
  type: {
    type: String
  },
  describe: {
    type: String
  },
  income: {
    type: String,
    required: true
  },
  // 支出
  expend: {
    type: String,
    required: true

  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const Profile = mongoose.model('profile', ProfileSchema)