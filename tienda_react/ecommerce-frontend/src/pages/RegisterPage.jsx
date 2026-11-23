import TopBar from '../components/layout/TopBar'
import Footer from '../components/layout/Footer'
import IntroPanel from '../components/register/IntroPanel'
import RegisterForm from '../components/register/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      <TopBar />
      <main className="layout">
        <IntroPanel />
        <RegisterForm />
      </main>
      <Footer />
    </>
  )
}
