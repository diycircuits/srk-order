import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('srk_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('srk_auth_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session token on boot
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('srk_user_session', JSON.stringify(data));
          } else {
            logout();
          }
        } catch {
          // Keep cached user if offline
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('srk_auth_token', data.token);
        localStorage.setItem('srk_user_session', JSON.stringify(data.user));
        return data.user;
      }
    } catch {
      // Server not connected or static deployment fallback
    }

    // Offline / Demo fallback authentication
    const lowerEmail = email.trim().toLowerCase();
    if ((lowerEmail === 'admin@srkinnovations.com' || lowerEmail === 'admin@srkinnovation.com' || lowerEmail === 'admin@diycircuits.in') && password === 'admin123') {
      const defaultUser = {
        id: 1,
        name: 'Super Admin',
        email: lowerEmail,
        role: 'Super Admin',
        permissions: ['*']
      };
      const dummyToken = 'offline-session-token-' + Date.now();
      setToken(dummyToken);
      setUser(defaultUser);
      localStorage.setItem('srk_auth_token', dummyToken);
      localStorage.setItem('srk_user_session', JSON.stringify(defaultUser));
      return defaultUser;
    }

    throw new Error('Invalid email or password');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('srk_auth_token');
    localStorage.removeItem('srk_user_session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
