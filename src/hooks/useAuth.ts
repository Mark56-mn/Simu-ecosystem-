import React, { useState, useEffect, createContext, useContext } from 'react';
import { verifyPin, enableBiometric, initWallet } from '../modules/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasWallet(localStorage.getItem('has_wallet') === 'true');
    setLoading(false);
  }, []);

  const login = async (pin?: string) => {
    if (pin) {
      const valid = await verifyPin(pin);
      if (valid) setIsAuthenticated(true);
      return valid;
    } else {
      const valid = await enableBiometric();
      if (valid) setIsAuthenticated(true);
      return valid;
    }
  };

  const setup = async (pin: string) => {
    await initWallet(pin);
    setHasWallet(true);
    setIsAuthenticated(true);
  };

  if (loading) return null;

  return React.createElement(
    AuthContext.Provider,
    { value: { isAuthenticated, hasWallet, login, setup } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
