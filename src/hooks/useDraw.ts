/**
 * Secret Santa Draw Algorithm Hook
 * Handles the matching logic with exclusion constraints
 */

import type { Participant, Exclusion } from '../types';

interface DrawResult {
  success: boolean;
  matches: Record<string, string>;
  errorMessage?: string;
}

export function useDraw() {
  const performDraw = (
    participants: Participant[],
    exclusions: Exclusion[]
  ): DrawResult => {
    if (participants.length < 3) {
      return {
        success: false,
        matches: {},
        errorMessage: 'Minimum 3 participants required',
      };
    }

    const ids = participants.map((p) => p.id);
    const constraints = new Map<string, Set<string>>();

    // Build constraints map
    for (const exc of exclusions) {
      if (!constraints.has(exc.selectorId)) {
        constraints.set(exc.selectorId, new Set());
      }
      constraints.get(exc.selectorId)?.add(exc.targetId);
    }

    const matches: Record<string, string> = {};
    const usedReceivers = new Set<string>();

    // Backtracking algorithm to find valid matching
    const solve = (index: number): boolean => {
      if (index === ids.length) return true;

      const giver = ids[index];
      const candidates = [...ids].sort(() => Math.random() - 0.5);

      for (const receiver of candidates) {
        // Can't give to yourself
        if (receiver === giver) continue;

        // Already assigned as receiver
        if (usedReceivers.has(receiver)) continue;

        // Check exclusion constraints
        if (constraints.get(giver)?.has(receiver)) continue;

        // Try this assignment
        matches[giver] = receiver;
        usedReceivers.add(receiver);

        if (solve(index + 1)) return true;

        // Backtrack
        delete matches[giver];
        usedReceivers.delete(receiver);
      }

      return false;
    };

    const success = solve(0);

    if (!success) {
      return {
        success: false,
        matches: {},
        errorMessage: 'Impossible to draw with current exclusion rules',
      };
    }

    return {
      success: true,
      matches,
    };
  };

  return { performDraw };
}
