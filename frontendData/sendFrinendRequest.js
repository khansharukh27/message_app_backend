const express = require('express');
const routerFriend = express.Router();
// const routerFriendAccept = express.Router()
// const routerFriendCancle = express.Router()
const Friend = require('../schemas/FriendSchema');
const app = express()
// app.use(bodyParser.json());  // If you're using express < 4.16.0
app.use(express.json());  // Uncomment this if you're using express >= 4.16.0


// Send friend request
routerFriend.post('/sendFriendRequest/:userId', async (req, res) => {
  const { userId } = req.params;
  const { senderId, userProfile } = req.body;

  try {
    const existingRequest = await Friend.findOne({ userId1: senderId, userId2: userId });
    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    const friendRequest = new Friend({ userId1: senderId, userId2: userId, status: 'pending', userProfile });
    await friendRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept friend request
routerFriend.post('/acceptFriendRequest/:userId', async (req, res) => {
  const { userId } = req.params;
  const { senderId } = req.body;
  console.log('userId:-',userId)
  console.log('senderId:-',senderId)

  try {
    const friendRequest = await Friend.findOne({ userId1: senderId, userId2: userId, status: 'pending' });
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel friend request
routerFriend.post('/cancelFriendRequest/:userId', async (req, res) => {
  const { userId } = req.params;
  const { senderId } = req.body;

  try {
    const friendRequest = await Friend.findOne({ userId1: senderId, userId2: userId, status: 'pending' });
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    await friendRequest.deleteOne();

    res.status(200).json({ message: 'Friend request canceled successfully' });
  } catch (error) {
    console.error('Error canceling friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get accepted friend requests
routerFriend.get('/accepted', async (req, res) => {
  try {
    const acceptedData = await Friend.find({ status: 'accepted' });

    res.status(200).json(acceptedData);
  } catch (error) {
    console.error('Error fetching accepted data:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

  routerFriend.delete('/deleteFriendRequest/:userId', async (req, res) => {
    const { userId } = req.params;
    // const senderId = req.body.senderId;
    console.log('userId',userId)
    // console.log('senderId:-',senderId)
  
    try {
      // Find the friend request
      const friendRequest = await Friend.findOneAndDelete({ userId2: userId, status: 'accepted' });
  
      if (!friendRequest) {
        return res.status(404).json({ error: 'Friend request not found or already canceled' });
      }
  
      res.status(200).json({ message: 'Friend request canceled successfully' });
    } catch (error) {
      console.error('Error canceling friend request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = routerFriend;