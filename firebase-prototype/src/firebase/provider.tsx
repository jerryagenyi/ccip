'use client';

import { createContext, useContext } from 'react';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export type FirebaseContextValue = {
  auth: Auth;
  firestore: Firestore;
  getFirebase: () => Promise<{ auth: Auth; firestore: Firestore }>;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  ...value
}: {
  children: React.ReactNode;
} & FirebaseContextValue) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function getFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('getFirebase must be used within a FirebaseProvider');
  }
  return context.getFirebase();
}
