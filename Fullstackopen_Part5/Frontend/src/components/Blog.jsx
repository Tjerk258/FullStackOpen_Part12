import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'



const Blog = ({ blog, deleteBlog, user, likeBlog }) => {
  const [show, setShow] = useState(false)

  const borderStyle = {
    borderStyle: 'solid',
    borderWidth: '2px',
    margin: 4
  }

  const likeHandle = async () => {
    blog.likes += 1
    likeBlog(blog, blog.id)
  }

  const deleteHandle = async () => {
    if (window.confirm(`Remove blog ${blog.title} By ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const isOwner = (user && blog.user) ? (blog.user.id === user.id ? true : false) : false

  return (
    <div className='blog' style={borderStyle}>
      <b>{blog.title} By {blog.author} </b><button onClick={() => setShow(!show)}>{show ? 'Hide' : 'View'}</button>
      {show &&
        <div>
          <div>url: <a rel='noreferrer' target='_blank' href={blog.url} >{blog.url}</a></div>
          <div>likes: {blog.likes}<button onClick={likeHandle}>Like</button></div>
          <div>User: {blog.user ? blog.user.username : 'Deleted'}</div>
          {isOwner &&
            <button onClick={deleteHandle}>Delete</button>
          }
        </div>
      }
    </div>
  )

}

Blog.propTypes = {
  blog: PropTypes.object,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object,
  likeBlog: PropTypes.func.isRequired
}

export default Blog