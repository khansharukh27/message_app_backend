const express = require('express');
const routerProfile = express.Router();
const User = require('../schemas/UserSchema');

// Fetch user profile
routerProfile.get('/profile', async (req, res) => {
    const loggedInEmail = req.query.loggedInEmail;
    // console.log('Email by profile:-', loggedInEmail);

    try {
        if (!loggedInEmail) {
            return res.status(400).json({ message: 'Email parameter is missing' });
        }
        
        // Retrieve user data from the database based on the email
        const userProfile = await User.findOne({ Email: loggedInEmail });
        
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ userProfile });
        // console.log('profile json user:-', userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = routerProfile;
