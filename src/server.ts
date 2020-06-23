import app from './app'
import { port } from './config'
import mongoose from 'mongoose'

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

function close () {
  console.log('shutting down server')
  Promise.all([server.close(), mongoose.connection.close()]).then(() => {
    process.exit(0)
  })
}

process.on('SIGINT', close)
process.on('SIGTERM', close)
