import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ createBlog }) => {
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url
    }
    createBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')

  }

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type='text'
          name='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder='title'
          id='title'
        />
      </div>
      <div>
        author
        <input
          type='text'
          name='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='author'
          id='author'
        />
      </div>
      <div>
        url
        <input
          type='text'
          name='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder='url'
          id='url'
        />
      </div>
      <button id='blog-save-button' type="submit">save</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm