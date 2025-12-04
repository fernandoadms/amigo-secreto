import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateGroupScreenProps } from '@/types';

export function CreateGroupScreen({ onBack, onCreateGroup, isLoading }: CreateGroupScreenProps) {
  const [groupName, setGroupName] = useState('');
  const [adminName, setAdminName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && adminName.trim()) {
      onCreateGroup(groupName, adminName);
    }
  };

  return (
    <main className="flex flex-col min-h-screen px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Novo Sorteio</CardTitle>
            <CardDescription>
              Crie um grupo para organizar seu amigo secreto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nome do Grupo</Label>
                <Input
                  id="groupName"
                  placeholder="Ex: Amigo Secreto da Família"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminName">Seu Nome</Label>
                <Input
                  id="adminName"
                  placeholder="Digite seu nome"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !groupName.trim() || !adminName.trim()}
              >
                {isLoading ? 'Criando...' : 'Criar Grupo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
