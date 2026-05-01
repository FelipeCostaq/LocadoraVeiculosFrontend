import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/manage/info');
      console.log('Informações do usuário obtidas:', response.data);
      setUser(response.data);
      return response.data; // Return data for easier handling
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log('Enviando POST para /auth/login...');
    await api.post('/auth/login?useCookies=true&useSessionCookies=true', { email, password });
    console.log('POST login OK, verificando sessão...');
    const userData = await checkAuth();
    if (!userData) {
      throw new Error('Falha ao obter dados do usuário após login. Verifique as configurações de CORS/Cookies.');
    }
  };

  const register = async (email, password) => {
    await api.post('/auth/register', { email, password });
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
