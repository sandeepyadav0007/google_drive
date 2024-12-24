const mongoose = require('mongoose')
require('dotenv').config();
async function connectToDB(){
   await mongoose.connect(process.env.MONGODB_URI ).then(()=>{
        console.log('Connected to Db')
    })
}

module.exports = connectToDB