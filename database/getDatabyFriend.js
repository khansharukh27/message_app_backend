const express = require('express');
// const dataModel = require('../schemas/UserSchema'); // Assuming this schema is for general data
const Friend = require('../schemas/FriendSchema'); // Assuming this schema is for friend-related data
const cors = require('cors');

const app = express();
app.use(cors());

const getDatabyFriend = express.Router(); // Corrected the router name
getDatabyFriend.get('/getDatabyFriend', async (req, res) => { 
    try {
        const friends = await Friend.find();
        if (friends.length > 0) {
            res.json(friends);
            // console.log(friends);
        } else {
            console.log('No friend data found');
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
module.exports = getDatabyFriend