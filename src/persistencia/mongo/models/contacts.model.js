import mongoose from 'mongoose'

const collection = 'contacts'

const schema = new mongoose.Schema({
    name: String,
    phone: String
})

export const contactModel = mongoose.model(collection, schema)