import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { attemptLogin, clearSession, getSession } from "../services/storage.js";

const AuthContext = createContext(null);

// Guarda la sesión en el estado y la comparte con toda la app (Context API).
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const login = useCallback((usuario, clave, rol) => {
    const resultado = attemptLogin(usuario, clave, rol);
    if (resultado.ok) setSession(resultado.session);
    return resultado;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
