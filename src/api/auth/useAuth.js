import { createContext, useContext, useEffect, useState } from 'react'

import { init, logIn as authLogin } from './auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()
  useEffect(() => {
    init((user) => {
      setUser(user)
    })
  }, [])

  function logIn() {
    authLogin()
    console.log('log in')
  }

  const contextValue = {
    user,
    logIn,
  }
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
