import { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    setUsername('')
    setPassword('')
    handleLogin(username, password)
  }

  return (
    <form onSubmit={login}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          id='username'
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          id='password'
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default Login