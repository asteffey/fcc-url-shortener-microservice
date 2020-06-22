import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', (err) => console.error(`MongoDB connection error: ${err}`))

function close () {
  console.log('MongoDB Closed')
}

process.on('SIGINT', close)
process.on('SIGTERM', close)
