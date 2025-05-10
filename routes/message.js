// routes/message.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploader } = require('../config/cloudinary');
const Message = require('../models/messageModel');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    let media = null;

    if (req.file) {
      const result = await uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'chat-media'
        },
        (error, result) => {
          if (error) throw error;
          media = {
            url: result.secure_url,
            type: result.resource_type === 'video' ? 'video' : 'image'
          };
          saveMessage();
        }
      );

      // Stream buffer to Cloudinary
      require('streamifier').createReadStream(req.file.buffer).pipe(result);
    } else {
      saveMessage();
    }

    async function saveMessage() {
      const newMsg = new Message({
        sender: req.user._id,
        receiver: receiverId,
        content: message || '',
        media
      });

      const saved = await newMsg.save();
      res.json({
        _id: saved._id,
        sender: saved.sender.toString(),
        receiver: saved.receiver.toString(),
        content: saved.content,
        media: saved.media,
        liked: saved.liked
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Message send failed' });
  }
});

// Like or unlike a message
router.post('/like/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    message.liked = !message.liked;
    await message.save();
    res.json({ liked: message.liked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like message' });
  }
});

module.exports = router;
