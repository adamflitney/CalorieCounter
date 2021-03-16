import { useAuth } from '../api/auth/useAuth'

function App() {
  const { user, logIn } = useAuth()
  console.log('user', user)
  return (
    <div className='App'>
      <button onClick={logIn}>Log In!</button>
    </div>
  )
}

export default App
