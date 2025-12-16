import { FirebaseClientProvider } from './client-provider';
import { useFirebase, FirebaseProvider, getFirebase } from './provider';
import { useUser } from './auth/use-user';
import { useDoc } from './firestore/use-doc';
import { useCollection } from './firestore/use-collection';

// This is a barrel file. More about barrel files: https://basarat.gitbook.io/typescript/main-1/barrel
export {
  FirebaseClientProvider,
  FirebaseProvider,
  getFirebase,
  useFirebase,
  useUser,
  useDoc,
  useCollection,
};
