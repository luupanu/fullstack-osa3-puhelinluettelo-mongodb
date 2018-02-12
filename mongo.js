const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

const args = process.argv.slice(2)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const printAll = () => {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number
  })

  person
    .save()
    .then(() => {
      console.log(`${name} (${number}) successfully saved!`)
      mongoose.connection.close()
    })
}

if (args.length === 0) {
  mongoose.connect(url)
  printAll()
  return
}

if(args.length !== 2) {
  console.log('Usage: no arguments => print the phonebook')
  console.log('       two arguments => add a new person (name, number)')
  return
} else {
  mongoose.connect(url)
  addPerson(args[0], args[1])
}