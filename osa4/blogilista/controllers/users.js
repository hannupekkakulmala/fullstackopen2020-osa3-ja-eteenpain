const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' })
  }
  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password too short' })
  }

  const saltRounds = 10

  const newUserObject = new User({
    username: body.username,
    name: body.name,
    passwordHash: await bcrypt.hash(body.password, saltRounds),
  })


  const savedUser = await newUserObject.save()
  response.status(201).json(savedUser.toJSON())
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter