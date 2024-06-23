require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('Yhdistetetään mongooseen')

mongoose.connect(url)
  .then(result => {
    console.log('Yhdistetty MongoDB')
    console.log('Tietokanta:', result.connections[0].name)
  })
  .catch((error) => {
    console.log('Virhe mongoon yhistämisessä:', error.message)
  })

const phonenumberValidator = (number) => {
  return /^\d{2,3}-\d{5,}$/.test(number)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    minlength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: phonenumberValidator,
      message: props => `${props.value} is not a valid phone number! It should be in the format XX-XXXXX or XXX-XXXXX`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)


