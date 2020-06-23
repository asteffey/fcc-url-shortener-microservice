import { Router } from 'express'
import * as ShortUrl from '../controller/ShortUrl'

const getUrl = Router()

getUrl.get('/:shortId', ({ params: { shortId } }, res, next) => {
  ShortUrl.getOriginalUrl(shortId)
    .then(original => {
      if (original) {
        res.redirect(301, original)
      } else {
        res.status(400)
        res.send(`${shortId} is not a valid identifier`)
      }
    }).catch(err => next(err))
})

export default getUrl
