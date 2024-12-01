const express = require('express')
const userRouter = require('./routes/user.routes')
const dotenv =require('dotenv')
const cookieParser = require('cookie-parser')
const connectToDB = require('./config/db')
const indexRouter = require('./routes/index.routes')
const path = require('path')
connectToDB()

const app = express() 
const PORT = 3000     
app.use(express.static(path.join(__dirname,'public')))

dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs')

app.use("/" ,indexRouter)
app.use("/user" ,userRouter)   
      

app.listen(PORT || 3000, () => { console.log(`Server is running on port ${PORT}`); }) 