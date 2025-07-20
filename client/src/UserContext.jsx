import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Migration: if user._id exists but user.id does not, copy _id to id
  useEffect(() => {
    if (user && user._id && !user.id) {
      const migratedUser = { ...user, id: user._id };
      setUser(migratedUser);
      localStorage.setItem('user', JSON.stringify(migratedUser));
    }
  }, [user]);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 