import express from 'express'
import mongoose from 'mongoose'
const bodyParser = require('body-parser')
const passport = require('passport')

// custom modules
import { mongoConfig } from './config'
import users from './routes/api/users'
import profiles from './routes/api/profiles'

// create app application
const app = express()

// DB config
const db = mongoConfig.mongoURI

// connect to mongodb
mongoose.connect(db, {useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

// use body-parser middleware

// passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// set port
const port = process.env.PORT || 5000

// 接口路由
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})