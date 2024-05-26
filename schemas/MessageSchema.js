const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    // required: true,
  },
  likes: { type: Boolean, default:false },
  dislikes: { type: Boolean , default: false },
  file: { type: String,default:null},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
