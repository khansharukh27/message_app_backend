const express = require('express')
const dataModel = require('../schemas/UserSchema')
const cors = require('cors')
const routerLogging = express.Router()
const app = express()
app.use(cors());
routerLogging.post('/loging',async(req,res)=>{
    const {Email,Password} = req.body;
    // console.log(Email,Password)
    try {
        // Check if both email and password are provided
       
        // Find user by email and password
        const user = await dataModel.findOne({ Email,Password });
        // console.log('User found in the database:', user);

        if (user) {
            // User found, login successful
            // res.json({user})
            res.status(200).json({ message: 'Login success', Email,user });
        } else {
            // User not found or invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  })
  module.exports = routerLogging