const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return blog.likes + total
  }, 0)
}

const favoriteBlog = (blogs) => {
  let max = 0, maxIndex = 0
  for(let index = 0; index < blogs.length; index++) {
    if(blogs[index].likes > max) {
      max = blogs[index].likes
      maxIndex = index
    }
  }
  const newObject = {
    title: blogs[maxIndex].title,
    author: blogs[maxIndex].author,
    likes: blogs[maxIndex].likes
  }
  return newObject
 
}

const mostBlogs = (blogs) => {
  let authors = [], frequency = []
  let author

  for(let i = 0; i < blogs.length; i++) {
    author = blogs[i].author
    if(authors.includes(author)) {
      let index = authors.indexOf(author)
      frequency[index] += 1
    } else {
      authors.push(author)
      frequency.push(1)
    }
  }
  const highestIndex = frequency.indexOf(Math.max(...frequency))

  const newObject = 
  {
    author: authors[highestIndex],
    blogs: frequency[highestIndex]
  }
  return newObject
}

const mostLikes = (blogs) => {
  let authors = [], likes = []
  let author, num_likes
  for(let i = 0; i < blogs.length; i++) {
    author = blogs[i].author
    num_likes = blogs[i].likes
    if(authors.includes(author)) {
      let index = authors.indexOf(author)
      likes[index] += num_likes
    } else {
      authors.push(author)
      likes.push(num_likes)
    }
  }
  const highestIndex = likes.indexOf(Math.max(...likes))
  
  const newObject = 
  {
    author: authors[highestIndex],
    likes: likes[highestIndex]
  }
  return newObject
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}