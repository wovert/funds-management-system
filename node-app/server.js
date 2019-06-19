import express from 'express'
import mongoose from 'mongoose'
const bodyParser = require('body-parser')

// custom modules
import { mongoConfig } from './config'
import users from './routes/api/users'

// create app application
const app = express()

// DB config
const db = mongoConfig.mongoURI

// connect to mongodb
mongoose.connect(db, {useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

// use body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set port
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/api/users', users)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})