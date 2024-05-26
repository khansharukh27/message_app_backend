const mongoose = require('mongoose');

const uri = 'mongodb+srv://shahrukhmirza88:NPg8QwSeWAeMqrDp@cluster0.ykfqxt0.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0';

async function connectAndPerform() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        // You don't need to explicitly specify the database name when using Mongoose
        // Mongoose will create the database if it does not exist
        // Perform operations here
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for handling in the caller function
    } 
}

module.exports = connectAndPerform;
