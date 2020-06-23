import cors from 'cors'
import express from 'express'
import newUrl from './routes/newUrl'
import getUrl from './routes/getUrl'
import './db'

const app = express()

app.use(cors({ optionsSuccessStatus: 200 }))

app.use(express.static('public'))

app.use('/api/shorturl/new', newUrl)

app.use('/api/shorturl', getUrl)

export default app
