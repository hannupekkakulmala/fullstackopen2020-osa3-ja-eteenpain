require('dotenv').config()
//const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
const mongoose = require('mongoose')


const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

//const mongoUrl = process.env.MONGODB_URI
const mongoUrl = 'mongodb+srv://admin:admin@cluster0-gkhh1.mongodb.net/blogs?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body

  console.log(request.headers)
  console.log(`request.body.title = ${request.body.title}`)
  console.log(`request.body.author = ${request.body.author}`)
  console.log(`request.body.url = ${request.body.url}`)
  console.log(`request.body.likes = ${request.body.likes}`)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

/*
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch( error => next(error))

})

*/


const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})