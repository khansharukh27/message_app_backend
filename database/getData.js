const express = require('express');
const dataModel = require('../schemas/UserSchema'); // Assuming this schema is for general data
// const Friend = require('../schemas/FriendSchema'); // Assuming this schema is for friend-related data
const cors = require('cors');

const app = express();
app.use(cors());

const routerget = express.Router();

routerget.get('/getData', async (req, res) => {
    try {
        const users = await dataModel.find();
        if (users.length > 0) {
            res.json(users);
            // console.log(users);
        } else {
            console.log('No users found');
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = routerget; // Export both routers
