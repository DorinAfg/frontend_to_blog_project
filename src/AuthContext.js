import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // אתחול מצב האימות מהנתונים ב-localStorage אם יש
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') && localStorage.getItem('username') ? true : false
  );

  const login = (username, token) => {
    setIsAuthenticated(true);
    localStorage.setItem('username', username); // שמור את שם המשתמש ב-localStorage
    localStorage.setItem('token', token); // שמור את ה-token ב-localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
