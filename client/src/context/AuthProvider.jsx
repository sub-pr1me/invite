import { createContext, useState } from "react"
import { fetchVenues } from '../functions/FetchVenues'

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [activeEmail, setActiveEmail] = useState(null);
  const [active, setActive] = useState('home');
  const [customize, setCustomize] = useState(null);
  const venuesPromise = fetchVenues();

  return (
    <AuthContext.Provider value={{
      auth, setAuth, venuesPromise, activeEmail, setActiveEmail,
      active, setActive, customize, setCustomize }}
    >{children}
    </AuthContext.Provider>
  );
};

export default AuthContext;