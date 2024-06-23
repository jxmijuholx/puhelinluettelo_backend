require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('Yhdistetetään mongooseen')

mongoose.connect(url)
    .then(result => {
        console.log('Yhdistetty MongoDB')
    })
    .catch((error) => {
        console.log('Virhe mongoon yhistämisessä:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)


