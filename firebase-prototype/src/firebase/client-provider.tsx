'use client';

import { app } from '@/firebase/config';
import { FirebaseProvider, getFirebase } from '@/firebase/provider';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return (
    <FirebaseProvider
      auth={auth}
      firestore={firestore}
      getFirebase={async () => {
        return {
          auth,
          firestore,
        };
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
