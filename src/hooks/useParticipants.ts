/**
 * Firebase Participants Management Hook
 * Handles participant CRUD operations and real-time subscriptions
 */

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  type Firestore,
} from 'firebase/firestore';
import type { Participant } from '../types';

interface UseParticipantsOptions {
  db: Firestore;
  appId: string;
  groupId: string | null;
}

export function useParticipants({ db, appId, groupId }: UseParticipantsOptions) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to participants changes in real-time
  useEffect(() => {
    if (!groupId) {
      return;
    }

    setIsLoading(true);
    const participantsRef = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'groups',
      groupId,
      'participants'
    );

    const q = query(participantsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const parts: Participant[] = [];
        snapshot.forEach((docSnap) => {
          parts.push(docSnap.data() as Participant);
        });
        setParticipants(parts);
        setIsLoading(false);
      },
      (error) => {
        console.error('Participants subscription error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, appId, groupId]);

  // Add participant
  const addParticipant = async (
    targetGroupId: string,
    name: string
  ): Promise<void> => {
    const newId = Math.random().toString(36).substring(2, 11);
    const partRef = doc(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'groups',
      targetGroupId,
      'participants',
      newId
    );

    await setDoc(partRef, {
      id: newId,
      name,
      claimedBy: null,
    });
  };

  // Remove participant
  const removeParticipant = async (
    targetGroupId: string,
    participantId: string
  ): Promise<void> => {
    const partRef = doc(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'groups',
      targetGroupId,
      'participants',
      participantId
    );

    await deleteDoc(partRef);
  };

  // Claim participant (guest joins via link)
  const claimParticipant = async (
    targetGroupId: string,
    participantId: string,
    userUid: string
  ): Promise<void> => {
    const partRef = doc(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'groups',
      targetGroupId,
      'participants',
      participantId
    );

    await updateDoc(partRef, {
      claimedBy: userUid,
    });
  };

  return {
    participants,
    isLoading,
    addParticipant,
    removeParticipant,
    claimParticipant,
  };
}
