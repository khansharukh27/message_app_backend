const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique:true },
  userId2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique:true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;