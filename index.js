const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

const PORT = process.env.PORT || 3001
const baseUrl = '/api/persons'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.delete(`${baseUrl}/:id`, (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformed id' })
    })
})

app.get(`${baseUrl}`, (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get(`${baseUrl}/:id`, (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      person ? res.json(Person.format(person)) :
        res.status(404).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformed id' })
    })
})

app.post(`${baseUrl}`, (req, res) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(e => {
      if (e.name === 'BulkWriteError' && e.code === 11000) {
        return res.status(409).json({ error: `name '${body.name}' already exists` })
      }
      const errors = e.errors
      if (errors) {
        const messages = []
        Object.keys(errors).forEach(e => messages.push({ error: (errors[e].message) }))
        return res.status(400).json(messages)
      } else {
        console.log(e)
        return res.status(400).json({ error: 'unknown error' })
      }
    })
})

app.put(`${baseUrl}/:id`, (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformed id' })
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      const info = `<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
        ${new Date()}`
      res.send(info)
    })
    .catch(error => {
      console.log(error)
    })
})