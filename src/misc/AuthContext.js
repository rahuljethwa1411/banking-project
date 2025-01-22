import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Initialize user and token from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(storedUser);
    }
  }, []);

  // Get the current user
  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  // Check if the user is authenticated
  const userIsAuthenticated = () => {
    return localStorage.getItem('user') !== null && localStorage.getItem('token') !== null;
  };

  // Log in the user
  const userLogin = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token); // Store the token
    setUser(user);
  };

  // Log out the user
  const userLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    localStorage.removeItem('token'); // Clear token
    setUser(null); // Reset the user state
  };

  // Context value
  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider };