const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Schema = mongoose.Schema

const personSchema = new Schema({
  name: {
    type: String,
    required: [true, 'field \'name\' is required'],
    unique: true
  },
  number: {
    type: String,
    required: [true, 'field \'number\' is required']
  }
})

personSchema.statics.format = (person) => {
  const formattedPerson = { ...person._doc, id: person._id }
  delete formattedPerson._id
  delete formattedPerson.__v
  return formattedPerson
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person