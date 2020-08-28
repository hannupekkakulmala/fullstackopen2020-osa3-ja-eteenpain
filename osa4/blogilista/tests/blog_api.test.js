const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
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

afterAll(() => {
  mongoose.connection.close()
})