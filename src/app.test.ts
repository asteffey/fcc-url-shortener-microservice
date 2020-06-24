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
  const invalidUrl = 'http@notagoodurl'
  const toUrl = (shortId: string) => `${baseUrl}/api/shorturl/${shortId}`
  const validShortUrl = expect.stringMatching(new RegExp(`^${toUrl('[a-zA-Z0-9_-]{8}')}$`))

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
    expect(body.short_url).toEqual(toUrl(known.shortId))
  })

  it('creates a new shortened url', async () => {
    const { body } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${unknown}`)

    expect(body.original_url).toEqual(unknown)
    expect(body.short_url).toEqual(validShortUrl)
    expect(body.short_url).not.toEqual(toUrl(known.shortId))
  })

  it('returns error for invalid url', async () => {
    const { status, text } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${invalidUrl}`)
    expect(status).toEqual(400)
    expect(text).toMatch(/is not a valid URL/)
  })

  it('returns existing url', async () => {
    const { header: { location }, status } = await request(app)
      .get(`/api/shorturl/${known.shortId}`)
    expect(status).toEqual(301)
    expect(location).toEqual(known.originalUrl)
  })

  it('returns error for invalid short url', async () => {
    const { status, text } = await request(app)
      .get('/api/shorturl/00000000')
    expect(status).toEqual(400)
    expect(text).toMatch(/is not a valid identifier/)
  })

  it('sets and returns url', async () => {
    const { body } = await request(app)
      .post('/api/shorturl/new')
      .send(`url=${unknown}`)
    const path: string = body.short_url.replace(new RegExp(`^${baseUrl}`), '')
    console.log(path)
    const { header: { location }, status } = await request(app)
      .get(path)
    expect(status).toEqual(301)
    expect(location).toEqual(unknown)
  })
})
