import { createContext, useState } from "react"
import { fetchVenues } from '../functions/FetchVenues';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userStatus, setUserStatus] = useState('logged_out');
  const venuesPromise = fetchVenues();

  return (
    <AuthContext.Provider value={{
      auth, setAuth, userStatus, setUserStatus, venuesPromise }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;