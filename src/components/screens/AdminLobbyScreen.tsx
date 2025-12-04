import { useState } from 'react';
import {
  Users,
  Share2,
  Shuffle,
  UserPlus,
  Check,
  Trash2,
  LogOut,
  Ban,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { ExclusionsModal } from './ExclusionsModal';
import type { AdminLobbyScreenProps, Participant } from '@/types';

export function AdminLobbyScreen({
  group,
  participants,
  onDraw,
  onLeave,
  onAdminAdd,
  onAdminRemove,
  onSaveExclusions,
  onGenerateLink
}: AdminLobbyScreenProps & { onGenerateLink: (groupId: string, participantId: string) => string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExclusionsModal, setShowExclusionsModal] = useState(false);
  const [showDrawConfirm, setShowDrawConfirm] = useState(false);
  const [newName, setNewName] = useState('');
  const { toast } = useToast();

  const canDraw = group.status === 'open' && participants.length >= 3;

  const handleShare = (p: Participant) => {
    const link = onGenerateLink(group.id, p.id);

    // Mensagem personalizada para WhatsApp
    const message = `🎁😅 ${p.name}, não adianta fugir: você vai ter que comprar o presente. Então descobre logo quem você tirou no Amigo Secreto 😂👉 ${link}`;

    // URL encode da mensagem para WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Abre WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Compartilhar no WhatsApp",
      description: `Enviando link para ${p.name}.`
    });
  };

  const handleAddParticipant = () => {
    if (newName.trim()) {
      onAdminAdd(newName);
      setNewName('');
      setShowAddModal(false);
      toast({ title: "Participante adicionado!" });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl px-4 py-8 mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                ADMIN
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                ID: {group.id}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
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

        {/* Quick Actions */}
        {group.status === 'open' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              className="transition-colors cursor-pointer hover:bg-accent/50"
              onClick={() => setShowExclusionsModal(true)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-destructive/10">
                    <Ban className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold">Impedimentos</p>
                    <p className="text-sm text-muted-foreground">
                      {group.exclusions?.length || 0} regras
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card
              className="transition-colors cursor-pointer hover:bg-accent/50"
              onClick={() => setShowAddModal(true)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Adicionar</p>
                    <p className="text-sm text-muted-foreground">Nova pessoa</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Participants List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Participantes</CardTitle>
              </div>
              <Badge variant="secondary">{participants.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {participants.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum participante ainda.
                </div>
              ) : (
                participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={
                          p.claimedBy
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }>
                          {p.claimedBy ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            p.name.charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs uppercase text-muted-foreground">
                          {p.claimedBy ? 'Confirmado' : 'Pendente'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare(p)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      {group.status === 'open' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onAdminRemove(p.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Draw Button */}
        {group.status === 'open' && (
          <Card>
            <CardContent className="p-6">
              <Button
                size="lg"
                className="w-full"
                onClick={() => setShowDrawConfirm(true)}
                disabled={!canDraw}
              >
                <Shuffle className="w-5 h-5 mr-2" />
                {participants.length < 3
                  ? 'Mínimo 3 pessoas para sortear'
                  : 'Realizar Sorteio'}
              </Button>
              {!canDraw && participants.length < 3 && (
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Adicione pelo menos 3 participantes
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Participant Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Participante</DialogTitle>
            <DialogDescription>
              Adicione uma pessoa ao grupo
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="participantName">Nome</Label>
              <Input
                id="participantName"
                placeholder="Digite o nome"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddParticipant();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddParticipant} disabled={!newName.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draw Confirmation Modal */}
      <Dialog open={showDrawConfirm} onOpenChange={setShowDrawConfirm}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <DialogTitle className="text-center">Confirmar Sorteio?</DialogTitle>
            <DialogDescription className="text-center">
              Essa ação é irreversível e o resultado será revelado para todos os participantes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowDrawConfirm(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDrawConfirm(false);
                onDraw();
              }}
              className="w-full sm:w-auto"
            >
              Sortear Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exclusions Modal */}
      <ExclusionsModal
        open={showExclusionsModal}
        onOpenChange={setShowExclusionsModal}
        participants={participants}
        exclusions={group.exclusions || []}
        onSave={onSaveExclusions}
      />
    </main>
  );
}
