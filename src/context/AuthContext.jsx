import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Determine token key by role to prevent conflicts if both log in on same browser
    const tokenKey = userData.role === 'ADMIN' ? 'adminToken' : 'userToken';
    localStorage.setItem(tokenKey, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    if (user?.role === 'ADMIN') {
      localStorage.removeItem('adminToken');
    } else {
      localStorage.removeItem('userToken');
    }
    // Also clear just in case
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    setUser(null);
  };

  // Expose `admin` alias for backward compatibility with existing components
  const admin = user?.role === 'ADMIN' ? user : null;

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
