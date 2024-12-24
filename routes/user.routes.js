const express = require('express')
const {body , validationResult } = require('express-validator') 
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router()


router.get('/test', (req,res)=>{
    res.send("user test routes")
})

router.get('/register',(req,res)=>{
    res.render("register") 
})


router.get('/login',(req,res)=>{
    res.render("login")
})


router.post('/register' ,
    [
        body('username')
            .trim()
            .notEmpty().withMessage('Username cannot be empty')
            .isLength({min: 3}).withMessage('Username must be at least 3 characters long'),
        body('email')
            .trim()
            .notEmpty().withMessage('Email cannot be empty')
            .isEmail().withMessage('Must be a valid email'),
        body('password')
            .trim()
            .notEmpty().withMessage('Password cannot be empty')
            .isLength({min: 5}).withMessage('Password must be at least 5 characters long')
    ]
, 
    async(req,res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            message : "invalid data"
        })
    }

    // res.send(errors)
    // console.log(req.body);
    try {
        const { username, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: hashPassword
        });
        // res.redirect('login');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }
        res.status(500).json({
            message: 'Internal server error'
        });
    }
    // res.json(newUser);
    res.redirect('login');

})

router.post('/login',
    [
        body('username')
            .trim()
            .notEmpty().withMessage('Username cannot be empty')
            .isLength({min: 3}).withMessage('Username must be at least 3 characters long'),
        
        body('password')
            .trim()
            .notEmpty().withMessage('Password cannot be empty')
            .isLength({min: 5}).withMessage('Password must be at least 5 characters long')
    ]
,
    async(req,res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array(),
            message : "invalid data"
        })
    }

    const {username , password} =req.body
    const user = await userModel.findOne({
        username : username
    })

    if(!user){
        return res.status(400).json({
            message:'username or password incorrect'
        })
    }
    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        return res.status(400).json({
            message : 'username or password incorrect'
        })
    }

    const token = jwt.sign({
        userId:user._id,
        email:user.email,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    // res.send('Logged In')
    res.redirect('/home')
 
})

module.exports = router

