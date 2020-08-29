const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

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

afterAll(() => {
  mongoose.connection.close()
})