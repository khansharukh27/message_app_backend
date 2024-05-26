// UserSchema.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true},
    Email: { type: String, required: true,unique:true},    
    Password: { type: String, required: true },
    PhoneNumber: {type: String,required: true,unique:true},
    // ProfilePic: Buffer
});

module.exports = mongoose.model('dataModel', userSchema);


