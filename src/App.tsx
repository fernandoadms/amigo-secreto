import { useState, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useGroup } from './hooks/useGroup';
import { useParticipants } from './hooks/useParticipants';
import { useDraw } from './hooks/useDraw';
import { useToast } from './hooks/useToast';
import { useLinkHandler } from './hooks/useLinkHandler';

// Components
import { Toaster } from './components/ui/toaster';
import { HomeScreen } from './components/screens/HomeScreen';
import { CreateGroupScreen } from './components/screens/CreateGroupScreen';
import { AdminLoginScreen } from './components/screens/AdminLoginScreen';
import { AdminLobbyScreen } from './components/screens/AdminLobbyScreen';
import { GuestLobbyScreen } from './components/screens/GuestLobbyScreen';

// Types
import type { ViewType, Exclusion } from './types';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
    `Please check your .env.local file.`
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.projectId as string;

function AmigoSecretoContent() {
  const [view, setView] = useState<ViewType>('home');
  const [loading, setLoading] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);

  const { user } = useAuth(auth);
  const { group, createGroup, updateExclusions, performDraw: saveDrawResults, getGroupById } = useGroup({
    db,
    appId,
    groupId: currentGroupId,
  });
  const { participants, addParticipant, removeParticipant, claimParticipant } = useParticipants({
    db,
    appId,
    groupId: currentGroupId,
  });
  const { performDraw: calculateDraw } = useDraw();
  const { toast } = useToast();

  // Link handler para acessar via URL compartilhada
  const handleLinkDetected = useCallback((groupId: string, participantId: string) => {
    setCurrentGroupId(groupId);
    setCurrentParticipantId(participantId);

    // Reclamar participação quando o usuário acessar via link
    if (user?.uid) {
      claimParticipant(groupId, participantId, user.uid).catch((error) => {
        console.error('Error claiming participant:', error);
      });
    }

    setView('guest_lobby');
  }, [user, claimParticipant]);

  useLinkHandler({ onLinkDetected: handleLinkDetected });

  // Handlers
  const handleCreateGroup = async (groupName: string, adminName: string) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const newGroupId = await createGroup(groupName, user.uid);
      await addParticipant(newGroupId, `${adminName} (Admin)`);
      setCurrentGroupId(newGroupId);
      setView('admin_lobby');
    } catch {
      toast({ title: "Erro ao criar grupo", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (code: string) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const fetchedGroup = await getGroupById(code);
      if (!fetchedGroup) {
        toast({ title: "Grupo não encontrado", variant: "destructive" });
        return;
      }

      if (fetchedGroup.adminId !== user.uid) {
        toast({ title: "Acesso negado", description: "Você não é o admin deste grupo", variant: "destructive" });
        return;
      }

      setCurrentGroupId(code);
      setView('admin_lobby');
    } catch {
      toast({ title: "Erro de conexão", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    setCurrentGroupId(null);
    setCurrentParticipantId(null);
    setView('home');
  };

  const handleDraw = async () => {
    if (!group) return;

    setLoading(true);
    try {
      const result = calculateDraw(participants, group.exclusions);

      if (!result.success) {
        toast({
          title: "Sorteio impossível",
          description: result.errorMessage || "Não foi possível realizar o sorteio com as restrições definidas.",
          variant: "destructive"
        });
        return;
      }

      await saveDrawResults(group.id, result.matches);
      toast({ title: "Sorteio realizado com sucesso!" });
    } catch {
      toast({ title: "Erro ao salvar sorteio", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Render based on view
  if (view === 'home') {
    return (
      <HomeScreen
        onCreate={() => setView('create')}
        onAdminAccess={() => setView('admin_login')}
      />
    );
  }

  if (view === 'create') {
    return (
      <CreateGroupScreen
        onBack={() => setView('home')}
        onCreateGroup={handleCreateGroup}
        isLoading={loading}
      />
    );
  }

  if (view === 'admin_login') {
    return (
      <AdminLoginScreen
        onBack={() => setView('home')}
        onAdminLogin={handleAdminLogin}
        isLoading={loading}
      />
    );
  }

  if (view === 'admin_lobby') {
    if (!group) return null;

    return (
      <AdminLobbyScreen
        group={group}
        participants={participants}
        onDraw={handleDraw}
        onLeave={handleLeave}
        onAdminAdd={async (name: string) => {
          try {
            if (currentGroupId) {
              await addParticipant(currentGroupId, name);
              toast({ title: "Participante adicionado!" });
            }
          } catch {
            toast({ title: "Erro ao adicionar participante", variant: "destructive" });
          }
        }}
        onAdminRemove={async (participantId: string) => {
          try {
            if (currentGroupId) {
              await removeParticipant(currentGroupId, participantId);
              toast({ title: "Participante removido!" });
            }
          } catch {
            toast({ title: "Erro ao remover participante", variant: "destructive" });
          }
        }}
        onSaveExclusions={async (exclusions: Exclusion[]) => {
          try {
            if (group) {
              await updateExclusions(group.id, exclusions);
              toast({ title: "Impedimentos salvos!" });
            }
          } catch {
            toast({ title: "Erro ao salvar impedimentos", variant: "destructive" });
          }
        }}
        onGenerateLink={(groupId: string, participantId: string) => {
          return `${globalThis.location.origin}?g=${groupId}&p=${participantId}`;
        }}
      />
    );
  }

  if (view === 'guest_lobby') {
    if (!group || !currentParticipantId) return null;

    return (
      <GuestLobbyScreen
        group={group}
        participantId={currentParticipantId}
        participants={participants}
        onLeave={handleLeave}
      />
    );
  }

  // Placeholder for other views (to be implemented)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">View: {view} (Em desenvolvimento)</p>
    </div>
  );
}

export default function AmigoSecretoApp() {
  return (
    <>
      <AmigoSecretoContent />
      <Toaster />
    </>
  );
}
