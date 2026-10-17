import { createContext, useContext, useState } from "react";
import { attemptLogin, clearSession, getSession } from "../data/store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);

  const login = (usuario, clave, rol) => {
    const result = attemptLogin(usuario, clave, rol);
    if (result.ok) setSession(result.session);
    return result;
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
