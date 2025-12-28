import { createContext, useState } from "react";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ REQUIRED
    setUser(userData);
  }
  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
