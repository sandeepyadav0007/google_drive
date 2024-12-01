const express = require('express')
const upload = require('../config/multerconfig')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()
const fileModel =require('../models/files.models')
const imagekit =require('../config/imagekit.config')







router.get('/',(req,res)=>{
    res.render('index')
})




router.get('/home',authMiddleware, async(req,res)=>{
    const userFiles = await fileModel.find({
        user: req.user.userId
    })
    console.log(userFiles)
    res.render('home',{
        files:userFiles
    })

})

router.use('/file',upload )

// // routes/download.js
// const express = require('express');
// const router = express.Router();
// const fileModel = require('../models/files.models');
// const imagekit = require('../config/imagekit.config');

router.get('/download/:filepath', authMiddleware, async (req, res) => {
    try {
        // Decode the filepath from URL encoding
        const decodedFilepath = decodeURIComponent(req.params.filepath);
        
        // Find the file document that matches both the user and filepath
        const file = await fileModel.findOne({
            user: req.user.userId,
            filepath: decodedFilepath
        });

        // If no file found or user doesn't match, return unauthorized
        if (!file) {
            return res.status(404).json({
                message: 'File not found or unauthorized access'
            });
        }

        // Generate a temporary signed URL using ImageKit
        const signedUrl = imagekit.url({
            path: file.filepath,
            signed: true,
            expireSeconds: 25 // URL expires in 5 minutes
        })

        // Redirect to the signed URL for download
        // console.log(path)
        console.log(signedUrl)
        return res.redirect(signedUrl);

    } catch (error) {
        console.error('Download error:', error);
        return res.status(500).json({
            message: 'Error processing download request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


module.exports = router