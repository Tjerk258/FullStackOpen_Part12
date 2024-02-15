import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const getAllBlogs = async () =>
      setBlogs(await blogService.getAll())
    getAllBlogs()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      response.user = user
      setBlogs(blogs.concat(response))
      setNotificationMessageHandle(`a new blog: ${response.title} by: ${response.author} has been added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setErrorMessageHandle(error.message)
    }
  }

  const setNotificationMessageHandle = message => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  const setErrorMessageHandle = message => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setNotificationMessageHandle('Logged in')
    } catch (exception) {
      setErrorMessageHandle('Wrong credentials')
    }
  }

  const logoutHandle = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUser(null)
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotificationMessageHandle('succesful deleted')
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessageHandle('Not autarized to delete that blog')
      } else {
        setErrorMessageHandle('error while deleteing the blog')
      }
    }
  }

  const likeBlog = async (object, id) => {
    try {
      const likes = await blogService.put(id, object)
      setBlogs(blogs.map(blog => (blog.id === likes.id ? likes : blog)))
      return likes.likes
    } catch (error) {
      setErrorMessageHandle('Failed liking the blog')
      return
    }
  }


  return (
    <div>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      {!user &&
        <Togglable buttonLabel='logIn' begin={user ? false : true}>
          <h2>log in to application</h2>
          <Login handleLogin={handleLogin} />
        </Togglable>

      }

      <h2>Blogs</h2>
      {user && <div>
        <p>{user.name} logged in <button onClick={logoutHandle} >logout</button></p>
        <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
          <h3>Create new</h3>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <br />
      </div>
      }
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog} user={user} />
      )}
    </div>
  )
}

export default App