import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useCookies } from 'react-cookie'

function LoginForm() {
  const navigate = useNavigate()

  const [registerGood, setRegisterGood] = useState(false)

  const [email, setEmail] = useState('')
  const [parola, setParola] = useState('')
  const [cookies, setCookies] = useCookies(['utilizator'])

  const [utilizatori, setUtilizatori] = useState([])

  const getUtilizatori = async () => {
    const response = await fetch('/utilizatori') //default ruta get
    const data = await response.json()
    setUtilizatori(data)
  }

  useEffect(() => {
    getUtilizatori()
  }, [])

  const login = async () => {
    if (registerGood) {
      const utilizator = utilizatori.find(function (e) {
        return e.email === email && e.parola === parola
      })

      if (utilizator) {
        setCookies('email', email, { path: '/' })
        setCookies('id', utilizator.id, { path: '/' })
        navigate('/aplicatie')
      } else {
        setValidareDiv('NU EXISTA ACEST CONT !')
      }
    }
  }

  function validate(property, value) {
    if (property == 'email') {
      let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      if (regex.test(value)) {
        setRegisterGood(true)
        setValidareDiv('')
        setEmail(value)
      } else {
        setRegisterGood(false)
        setValidareDiv(`${property.toUpperCase()} nu poate fi ${value}`)
      }
    } else if (property == 'parola') {
      if (value != null && value.length > 2) {
        setRegisterGood(true)
        setValidareDiv('')
        setParola(value)
      } else {
        setRegisterGood(false)
        setValidareDiv(`${property.toUpperCase()} nu poate fi ${value}`)
      }
    }
  }

  function setValidareDiv(mesaj) {
    document.getElementById('validateR').innerText = mesaj
  }

  return (
    <div>
      <div className="form">
        <div>
          <label htmlFor="email">
            Email :
            <input
              name="email"
              type="text"
              placeholder="Introduceti email"
              onChange={(e) => validate('email', e.target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor="parola">
            Parola :
            <input
              name="parola"
              type="password"
              placeholder="Introduceti parola"
              onChange={(e) => validate('parola', e.target.value)}
            />
          </label>
        </div>
        <div>
          <input
            id="login"
            type="button"
            value="Autentificare"
            onClick={login}
          />
        </div>
        <div id="validateR"></div>
      </div>
    </div>
  )
}

export default LoginForm
