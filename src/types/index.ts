/**
 * Type Definitions for Secret Santa App
 * Centralized type definitions following TypeScript best practices
 */

import type { Timestamp } from 'firebase/firestore';

// ============================================================================
// Domain Entities
// ============================================================================

export interface User {
  uid: string;
  name: string | null;
  isAdmin: boolean;
}

export interface Participant {
  id: string;
  name: string;
  claimedBy: string | null;
  isManual?: boolean;
}

export interface Exclusion {
  selectorId: string;
  targetId: string;
}

export type GroupStatus = 'open' | 'drawn';

export interface Group {
  id: string;
  name: string;
  adminId: string;
  status: GroupStatus;
  matches: Record<string, string>;
  exclusions: Exclusion[];
  createdAt: Timestamp | null;
}

// ============================================================================
// Component Props
// ============================================================================

export interface HomeScreenProps {
  onCreate: () => void;
  onAdminAccess: () => void;
}

export interface CreateGroupScreenProps {
  onBack: () => void;
  onCreateGroup: (groupName: string, adminName: string) => void;
  isLoading: boolean;
}

export interface AdminLoginScreenProps {
  onBack: () => void;
  onAdminLogin: (code: string) => void;
  isLoading: boolean;
}

export interface AdminLobbyScreenProps {
  group: Group;
  participants: Participant[];
  onDraw: () => void | Promise<void>;
  onLeave: () => void;
  onAdminAdd: (name: string) => void | Promise<void>;
  onAdminRemove: (id: string) => void | Promise<void>;
  onSaveExclusions: (exclusions: Exclusion[]) => void | Promise<void>;
}

export interface GuestLobbyScreenProps {
  group: Group;
  participantId: string;
  participants: Participant[];
  onLeave: () => void;
}

export interface ExclusionsModalProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onSave: (exclusions: Exclusion[]) => void;
  onClose: () => void;
}

export interface ParticipantCardProps {
  participant: Participant;
  group: Group;
  onShare: (participant: Participant) => void;
  onRemove?: (id: string) => void;
  isCopied?: boolean;
}

// ============================================================================
// View State
// ============================================================================

export type ViewType =
  | 'home'
  | 'create'
  | 'admin_login'
  | 'guest_lobby'
  | 'admin_lobby';

export interface AppState {
  user: User | null;
  view: ViewType;
  loading: boolean;
  currentGroup: Group | null;
  participants: Participant[];
  currentParticipantId: string | null;
  isAppLoading: boolean;
}

// ============================================================================
// Utility Types (Note: Toast types moved to useToast hook for Shadcn compatibility)
// ============================================================================

export type ToastType = 'default' | 'destructive';
