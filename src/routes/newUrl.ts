import urlRegex from 'url-regex'
import { Router } from 'express'
import { urlencoded } from 'body-parser'
import { baseUrl } from '../config'
import * as ShortUrl from '../controller/ShortUrl'

const newUrl = Router()

newUrl.use(urlencoded({ extended: false }))

newUrl.post('/', ({ body: { url } }, res, next) => {
  if (urlRegex({ exact: true }).test(url)) {
    ShortUrl.newShortUrl(url)
      .then(({ originalUrl, shortId }) => res.json({
        original_url: originalUrl,
        short_url: `${baseUrl}/${shortId}`
      })).catch(err => next(err))
  } else {
    res.status(400)
    res.send(`${url} is not a valid URL`)
  }
})

export default newUrl
