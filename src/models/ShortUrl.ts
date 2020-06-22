import { Schema, model, Document } from 'mongoose'

const ShortUrlSchema = new Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortId: { type: String, required: true, unique: true, validate: /[a-zA-Z0-9-_]{8}/ }
})

export interface IShortUrl extends Document {
  originalUrl: string,
  shortId: string
}

export default model<IShortUrl>('ShortUrl', ShortUrlSchema)
