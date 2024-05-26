const express = require('express');
const Message = require('../schemas/MessageSchema');
const routerMessage = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

routerMessage.post('/messages', upload.single('file'), async (req, res) => {
  try {
    const { sender, recipient, content, like, dislike } = req.body;
    const fileDetails = req.file ? `/uploads/${req.file.filename}` : null; // Relative path
    console.log('fileDetails:-',fileDetails)

    const newMessage = new Message({
      sender,
      recipient,
      content,
      like,
      dislike,
      file: fileDetails
    });

    const savedMessage = await newMessage.save();
    console.log('file save:', savedMessage);
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

routerMessage.get('/messages/:sender/:recipient', async (req, res) => {
  try {
    const { sender, recipient } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
    console.log('message-res-sender-:-',messages)
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

routerMessage.put('/messages/:id/like', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.likes = true;
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Failed to like message' });
  }
});

routerMessage.put('/messages/:id/dislike', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.dislikes = true;
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error disliking message:', error);
    res.status(500).json({ error: 'Failed to dislike message' });
  }
});

module.exports = routerMessage;
