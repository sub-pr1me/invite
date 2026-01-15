import { createContext, useState } from "react"
import { fetchVenues } from '../functions/FetchVenues';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [userStatus, setUserStatus] = useState('logged_out');
  const [vens, setVens] = useState('visible');
  const venuesPromise = fetchVenues();

  return (
    <AuthContext.Provider value={{ auth, setAuth, userStatus, setUserStatus,
    vens, setVens, venuesPromise }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;