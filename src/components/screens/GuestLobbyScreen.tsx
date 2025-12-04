import { useState } from 'react';
import { Gift, LogOut, EyeOff, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GuestLobbyScreenProps } from '@/types';

export function GuestLobbyScreen({
  group,
  participantId,
  participants,
  onLeave
}: GuestLobbyScreenProps) {
  const [revealed, setRevealed] = useState(false);

  const myParticipant = participants.find(p => p.id === participantId);
  const myResultId = group.status === 'drawn' ? group.matches[participantId] : null;
  const myResultPerson = participants.find(p => p.id === myResultId);

  if (!myParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="mb-2">
              {group.name}
            </Badge>
            <h1 className="text-3xl font-bold">
              Olá, <span className="text-primary">{myParticipant.name}</span>
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLeave}
            className="rounded-full"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Result Card */}
        {group.status === 'drawn' ? (
          <Card className="border-2 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Seu Amigo Secreto</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-12 pb-16">
                {revealed && myResultPerson ? (
                  <div className="text-center animate-in fade-in zoom-in duration-500">
                    <h2 className="text-5xl font-bold tracking-tight mb-4">
                      {myResultPerson.name}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRevealed(false)}
                      className="mt-4"
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Esconder
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    onClick={() => setRevealed(true)}
                  >
                    <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <EyeOff className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Toque para revelar
                    </p>
                  </button>
                )}
              </CardContent>
            </div>
          </Card>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 mb-6 rounded-full bg-muted">
                <Clock className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
              <CardTitle className="mb-2">Sorteio Pendente</CardTitle>
              <CardDescription className="max-w-xs">
                O organizador ainda não realizou o sorteio. Você será notificado quando estiver pronto!
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grupo:</span>
              <span className="font-medium">{group.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participantes:</span>
              <span className="font-medium">{participants.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={group.status === 'drawn' ? 'default' : 'secondary'}>
                {group.status === 'drawn' ? 'Sorteado' : 'Aguardando'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
