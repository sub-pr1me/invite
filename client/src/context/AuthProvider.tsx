import { createContext, useState } from "react"
import { AuthContextType, AuthType } from "../types"

type AuthProviderProps = {
  children: React.ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthType>(null);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [active, setActive] = useState('home');
  const [customize, setCustomize] = useState<number | null>(null);

  return (
    <AuthContext.Provider value={{
      auth, setAuth, activeEmail, setActiveEmail,
      active, setActive, customize, setCustomize }}
    >{children}
    </AuthContext.Provider>
  );
};

export default AuthContext;