'use client';

import { useEffect, useState } from 'react';
import {
  onSnapshot,
  getDocs,
  query,
  collection,
} from 'firebase/firestore';
import type {
  CollectionReference,
  DocumentData,
  Query,
} from 'firebase/firestore';

export function useCollection<T extends DocumentData>(
  ref: CollectionReference<T> | Query<T> | null,
  options?: {
    listen: boolean;
  }
) {
  const listen = options?.listen ?? false;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setData([]);
      setLoading(false);
      return;
    }

    if (!listen) {
      getDocs(ref).then((snapshot) => {
        setData(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ref, listen]);

  return { data, loading };
}
