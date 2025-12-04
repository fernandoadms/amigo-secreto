/**
 * URL Link Handler Hook
 * Manages guest invitation links with query parameters
 */

import { useEffect } from 'react';

interface UseLinkHandlerOptions {
  onLinkDetected: (groupId: string, participantId: string) => void;
}

export function useLinkHandler({ onLinkDetected }: UseLinkHandlerOptions) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('g');
    const participantId = params.get('p');

    if (groupId && participantId) {
      onLinkDetected(groupId, participantId);
    }
  }, [onLinkDetected]);

  const generateInviteLink = (groupId: string, participantId: string): string => {
    const { origin, pathname } = window.location;
    return `${origin}${pathname}?g=${groupId}&p=${participantId}`;
  };

  const clearQueryParams = (): void => {
    const { title } = document;
    const { pathname } = window.location;
    window.history.replaceState({}, title, pathname);
  };

  return {
    generateInviteLink,
    clearQueryParams,
  };
}
