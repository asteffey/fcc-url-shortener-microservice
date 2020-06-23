import mongoose from 'mongoose'
import request from 'supertest'
import app from './app'
import { baseUrl } from './config'
import ShortUrlModel from './models/ShortUrl'

describe('url shortener api', () => {
  const unknown = 'http://unknown.com'
  const known = {
    originalUrl: 'http://known.com',
    shortId: '12345678'
  }
  const invalid = 'http:notagoodurl@com'
  const validShortUrl = expect.stringMatching(new RegExp(`^${baseUrl}/[a-zA-Z0-9_-]{8}$`))

  beforeAll(async () => {
    await ShortUrlModel.init()
  })

  afterAll(async () => {
    mongoose.connection.close()
  })

  beforeEach(async () => {
    await ShortUrlModel.create(known)
  })

  afterEach(async () => {
    await ShortUrlModel.deleteMany({})
  })

  it('returns existing shortened url', async () => {
    const { body } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${known.originalUrl}`)

    expect(body.original_url).toEqual(known.originalUrl)
    expect(body.short_url).toEqual(`http://localhost:3000/${known.shortId}`)
  })

  it('creates a new shortened url', async () => {
    const { body } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${unknown}`)

    expect(body.original_url).toEqual(unknown)
    expect(body.short_url).toEqual(validShortUrl)
    expect(body.short_url).not.toEqual(`${baseUrl}/${known.shortId}`)
  })

  it('returns error for invalid url', async () => {
    const { status, text } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${invalid}`)
    expect(status).toEqual(400)
    expect(text).toMatch(/is not a valid URL/)
  })
})
