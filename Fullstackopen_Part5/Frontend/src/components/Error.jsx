import PropTypes from 'prop-types'

const Error = ({ message }) => {
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === null) {
    return null
  }

  return (
    <div className='error' style={notificationStyle}>
      {message}
    </div>
  )
}

Error.propTypes = {
  message: PropTypes.string
}

export default Error