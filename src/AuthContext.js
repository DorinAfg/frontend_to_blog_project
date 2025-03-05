import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') && !!localStorage.getItem('username')
  );

  const login = (username, token) => {
    setIsAuthenticated(true);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);  // עכשיו שומר את הטוקן כמו שצריך
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
