/**
 * Firebase Authentication Hook
 * Manages user authentication with Firebase Anonymous Auth
 */

import { useState, useEffect } from 'react';
import {
  signInAnonymously,
  onAuthStateChanged,
  type Auth
} from 'firebase/auth';
import type { User } from '../types';

export function useAuth(auth: Auth) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize anonymous authentication
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    initAuth();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: null,
          isAdmin: false,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, isLoading };
}
