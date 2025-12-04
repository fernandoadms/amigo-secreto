/**
 * Firebase Group Management Hook
 * Handles group CRUD operations and real-time subscriptions
 */

import { useEffect, useState } from 'react';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { Group, Exclusion } from '../types';

interface UseGroupOptions {
  db: Firestore;
  appId: string;
  groupId: string | null;
}

export function useGroup({ db, appId, groupId }: UseGroupOptions) {
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to group changes in real-time
  useEffect(() => {
    if (!groupId) {
      setGroup(null);
      return;
    }

    setIsLoading(true);
    const groupRef = doc(db, 'artifacts', appId, 'public', 'data', 'groups', groupId);

    const unsubscribe = onSnapshot(
      groupRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setGroup(docSnap.data() as Group);
        } else {
          setGroup(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Group subscription error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, appId, groupId]);

  // Create new group
  const createGroup = async (
    name: string,
    adminUid: string
  ): Promise<string> => {
    const newGroupId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const groupRef = doc(db, 'artifacts', appId, 'public', 'data', 'groups', newGroupId);

    await setDoc(groupRef, {
      id: newGroupId,
      name,
      adminId: adminUid,
      status: 'open',
      matches: {},
      exclusions: [],
      createdAt: serverTimestamp(),
    });

    return newGroupId;
  };

  // Update exclusions
  const updateExclusions = async (
    targetGroupId: string,
    exclusions: Exclusion[]
  ): Promise<void> => {
    const groupRef = doc(db, 'artifacts', appId, 'public', 'data', 'groups', targetGroupId);
    await updateDoc(groupRef, { exclusions });
  };

  // Perform draw
  const performDraw = async (
    targetGroupId: string,
    matches: Record<string, string>
  ): Promise<void> => {
    const groupRef = doc(db, 'artifacts', appId, 'public', 'data', 'groups', targetGroupId);
    await updateDoc(groupRef, {
      matches,
      status: 'drawn',
    });
  };

  // Get group by ID (one-time fetch)
  const getGroupById = async (targetGroupId: string): Promise<Group | null> => {
    const groupRef = doc(db, 'artifacts', appId, 'public', 'data', 'groups', targetGroupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      return groupSnap.data() as Group;
    }
    return null;
  };

  return {
    group,
    isLoading,
    createGroup,
    updateExclusions,
    performDraw,
    getGroupById,
  };
}
