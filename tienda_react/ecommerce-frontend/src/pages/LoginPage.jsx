import { useState } from 'react'
import '../styles/login.css'
import LoginHeader from '../components/login/LoginHeader'
import LoginIntro from '../components/login/LoginIntro'
import LoginForm from '../components/login/LoginForm'
import LoginFooter from '../components/login/LoginFooter'

export default function LoginPage() {
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleMessage = (text, error = false) => {
    setMessage(text)
    setIsError(error)
  }

  return (
    <div className="login-page">
      <LoginHeader message={message} isError={isError} />
      <main className="login-main">
        <LoginIntro />
        <LoginForm onMessage={handleMessage} />
      </main>
      <LoginFooter />
    </div>
  )
}
