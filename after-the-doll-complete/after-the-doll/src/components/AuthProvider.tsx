// src/components/AuthProvider.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks';
import type { User } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
