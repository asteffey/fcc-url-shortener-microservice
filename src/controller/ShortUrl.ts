import crypto from 'crypto'
import base64url from 'base64url'

import ShortUrl from '../models/ShortUrl'

const DUPLICATE_KEY_ERROR = 11000

export async function newShortUrl (originalUrl: string) {
  try {
    return await ShortUrl.create({
      originalUrl,
      shortId: randomId()
    })
  } catch (err) {
    if (err.code === DUPLICATE_KEY_ERROR) {
      const existing = await ShortUrl.findOne({ originalUrl })
      if (existing === null) {
        throw new Error('Short URL cannot be created')
      }
      return existing
    }
    throw err
  }
}

function randomId () {
  return base64url(crypto.randomBytes(6))
}
