import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Participant, Exclusion } from '@/types';

interface ExclusionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  exclusions: Exclusion[];
  onSave: (exclusions: Exclusion[]) => void | Promise<void>;
}

export function ExclusionsModal({
  open,
  onOpenChange,
  participants,
  exclusions,
  onSave
}: ExclusionsModalProps) {
  const [localExclusions, setLocalExclusions] = useState<Exclusion[]>(exclusions);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');

  const handleAddExclusion = () => {
    if (selectedFrom && selectedTo && selectedFrom !== selectedTo) {
      const newExclusion: Exclusion = {
        selectorId: selectedFrom,
        targetId: selectedTo
      };

      // Verifica se a exclusão já existe
      const exists = localExclusions.some(
        e => e.selectorId === selectedFrom && e.targetId === selectedTo
      );

      if (!exists) {
        setLocalExclusions([...localExclusions, newExclusion]);
        setSelectedFrom('');
        setSelectedTo('');
      }
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setLocalExclusions(localExclusions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localExclusions);
    onOpenChange(false);
  };

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Desconhecido';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Impedimentos</DialogTitle>
          <DialogDescription>
            Defina quem não pode tirar quem no sorteio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Exclusion Form */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-semibold text-sm">Adicionar Impedimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">Quem tira</Label>
                <select
                  id="from"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedFrom}
                  onChange={(e) => setSelectedFrom(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {participants.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">Não pode tirar</Label>
                <select
                  id="to"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedTo}
                  onChange={(e) => setSelectedTo(e.target.value)}
                  disabled={!selectedFrom}
                >
                  <option value="">Selecione...</option>
                  {participants
                    .filter(p => p.id !== selectedFrom)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddExclusion}
              disabled={!selectedFrom || !selectedTo}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Impedimento
            </Button>
          </div>

          {/* Exclusions List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center justify-between">
              <span>Impedimentos Ativos</span>
              <Badge variant="secondary">{localExclusions.length}</Badge>
            </h3>

            {localExclusions.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Nenhum impedimento definido
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {localExclusions.map((exclusion, index) => (
                  <div
                    key={`${exclusion.selectorId}-${exclusion.targetId}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {getParticipantName(exclusion.selectorId)}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">não tira</span>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline">
                        {getParticipantName(exclusion.targetId)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExclusion(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Impedimentos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
