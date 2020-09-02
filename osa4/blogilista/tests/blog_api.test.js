const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const helper = require('../utils/test_helper')

describe('tests related to blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('returns correct amount of json blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })
  
  test('identifier is called id', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.map(blog => {
      expect(blog.id).toBeDefined()
    })
  })
  
  test('posting blogs work', async () => {
    const blogs_at_start = await Blog.countDocuments({})
  
    const blogObject = new Blog({
      title: 'New blog I just created',
      author: 'Mona Lizander',
      url: 'http://www.u.arizon/Go_To_Considered_Harmful.html',
      likes: 2,
    })
  
    await api
      .post('/api/blogs')
      .send(blogObject)
    
    const blogs_at_end = await Blog.countDocuments({})
    const response = await api.get('/api/blogs')
    const contents = response.body.map(blog => blog.title)
    
    expect(blogs_at_end).toEqual(blogs_at_start + 1)
    expect(contents).toContainEqual('New blog I just created')
  })
  
  test('if likes not given, its zero', async () => {
    const blogObject = new Blog({
      title: 'New blog I just created',
      author: 'Mona Lizander',
      url: 'http://www.u.arizon/Go_To_Considered_Harmful.html',
      likes: undefined,
    })
  
    await api
      .post('/api/blogs')
      .send(blogObject)
      
    const response = await api.get('/api/blogs/')
    expect(response.body[6].likes).toEqual(0)
  
  })
  
  test('if title doesn\'t exist, respond with 400', async () => {
    const blogObject = new Blog({
      title: undefined,
      author: 'Mona Lizander',
      url: 'http://www.u.arizon/Go_To_Considered_Harmful.html',
      likes: 15,
    })
  
    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(400)
  })
  
  test('if url doesn\'t exist, respond with 400', async () => {
    const blogObject = new Blog({
      title: 'New blog I just created',
      author: 'Mona Lizander',
      url: undefined,
      likes: 15,
    })
  
    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(400)
  })
  
  test('deleting a blog succeeds, ', async () => {
    
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1)
    
    const contents = blogsAtEnd.map(r => r.title)
    
    expect(contents).not.toContain(blogToDelete.title)
  })
  
  test('updating likes on a blog returns 200', async () => {
    
    const blogs = await helper.blogsInDb()
    let blogToUpdate = blogs[0]
    blogToUpdate.likes = 99999
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
    
    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate[0].likes).toEqual(99999)
  })
})

describe('tests related to users', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Returns 400 if username is shorter than 3 characters', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: 'ro',
      name: 'Unto Pokonen',
      password: 'FiatUndo'
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    const usernames = usersAtEnd.map(u => u.username)
    
    expect(usernames).not.toContain(newUser.username)


  })

  test('Returns 400 if username is undefined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: undefined,
      name: 'Unto Pokonen',
      password: 'FiatUndo'
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
      
    const usernames = usersAtEnd.map(u => u.username)
      
    expect(usernames).not.toContain(newUser.username)

  }) 

  test('Trying to add user that already exists should return error', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: 'root',
      name: 'Unto Pokonen',
      password: 'FiatUndo'
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersAtStart.length)

  })

  test('Returns 400 if password is shorter than 3 characters', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: 'rokkoi',
      name: 'Unto Pokonen',
      password: 'ab'
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    const usernames = usersAtEnd.map(u => u.username)
    
    expect(usernames).not.toContain(newUser.username)


  })

  test('Returns 400 if password is undefined', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: 'rokkoi',
      name: 'Unto Pokonen',
      password: undefined,
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
  
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    const usernames = usersAtEnd.map(u => u.username)
    
    expect(usernames).not.toContain(newUser.username)


  })
})

  




afterAll(() => {
  mongoose.connection.close()
})