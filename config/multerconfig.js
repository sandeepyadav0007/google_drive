const express = require('express');
const multer = require('multer');
const imagekit = require('../config/imagekit.config');
const fileModel = require('../models/files.models');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();
const fs = require('fs');

// Configure multer to use memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {

  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.originalname
  }, async function(error, result) {
    if (error) {
      return res.status(500).send(error);
    }
    
    try {
      const newFile = await fileModel.create({
        filepath: result.url, // Using the URL provided by ImageKit as the filepath
        name: result.name,
        user: req.user.userId  // Ensure userId is provided in the request body
      });
      // res.redirect('home')
      res.json(newFile);
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

module.exports = router;
