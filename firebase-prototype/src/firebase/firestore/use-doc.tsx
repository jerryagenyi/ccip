'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, getDoc } from 'firebase/firestore';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

export function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null,
  options?: {
    listen: boolean;
  }
) {
  const listen = options?.listen ?? false;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    if (!listen) {
      getDoc(ref).then((doc) => {
        setData(doc.exists() ? doc.data() : null);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onSnapshot(ref, (doc) => {
      setData(doc.exists() ? doc.data() : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ref, listen]);

  return { data, loading };
}
