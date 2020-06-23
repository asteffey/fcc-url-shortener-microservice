import mongoose from 'mongoose'
import { mongoUrl } from './config'

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection


db.on('error', (err) => console.error(`MongoDB connection error: ${err}`))
