import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../mock/data';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage or API
    const storedUser = localStorage.getItem('hr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For demo, let's not auto-login so they see the login page
      // setUser(USERS[0]); // Auto-login as Admin
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const foundUser = USERS.find(u => u.role === role) || USERS[0];
    localStorage.setItem('hr_user', JSON.stringify(foundUser));
    setUser(foundUser);
  };

  const logout = () => {
    localStorage.removeItem('hr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
