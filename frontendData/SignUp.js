const express = require('express');
const dataModel = require('../schemas/UserSchema');
const router = express.Router();
const cors = require('cors')
const app = express()
app.use(cors())

router.post('/signup', async (req, res) => {
    try {
        const { Name, Email, PhoneNumber, Password } = req.body
                // for duplication

        const existingUser = await dataModel.findOne({
            $or:[{Email},{PhoneNumber}]
        })
        if(existingUser){
            let errorMessage = ''
            if(existingUser.Email === Email){
                errorMessage += 'Email already Exist'
            }
            if(existingUser.PhoneNumber){
                errorMessage += 'PhoneNumber already exist'
            }
            return res.status(400).json({message:errorMessage}) 
        }
        const newUser = new dataModel({
            Name,
            Email,
            PhoneNumber,
            Password
        });
        
        // Save the new user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({ msg: 'Data saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'An error occurred while saving data' });
    }
});

module.exports = router;
