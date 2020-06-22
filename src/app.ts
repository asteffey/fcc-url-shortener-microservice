import cors from 'cors'
import express from 'express'
import shorturl from './routes/newUrl'
import './db'

const app = express()

app.use(cors({ optionsSuccessStatus: 200 }))

app.use(express.static('public'))

app.use('/api/shorturl/new', shorturl)

export default app
