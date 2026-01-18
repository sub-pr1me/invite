import { createContext, useState } from "react"
import { fetchVenues } from '../functions/FetchVenues';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userStatus, setUserStatus] = useState('logged_out');
  const [activeEmail, setActiveEmail] = useState(null);
  const venuesPromise = fetchVenues();

  return (
    <AuthContext.Provider value={{
      auth, setAuth, venuesPromise, userStatus, setUserStatus, activeEmail, setActiveEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;