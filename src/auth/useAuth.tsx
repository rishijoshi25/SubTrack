import { useContext } from 'react';
import type { AuthContextType } from '../types/auth.types';
import AuthContext from './AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log(context);
  return context;
};