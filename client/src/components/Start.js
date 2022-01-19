import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState('')

  return (
    <div>
      <h1>Aplicații web care să permită gestionarea bug-urilor</h1>
      <fieldset className="btn-autentificare">
        <div>
          <span id="left">
            <input
              className="radioBtns"
              name="btn"
              type="radio"
              value="login"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="login" id="autentificare">
              AUTENTIFICARE
            </label>
          </span>
          <span>
            <input
              className="radioBtns"
              name="btn"
              type="radio"
              value="register"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="register" id="inregistrare">
              ÎNREGISTRARE
            </label>
          </span>
        </div>
      </fieldset>

      {value === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}

export default App
