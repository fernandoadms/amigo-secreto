import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminLoginScreenProps } from '@/types';

export function AdminLoginScreen({ onBack, onAdminLogin, isLoading }: AdminLoginScreenProps) {
  const [groupCode, setGroupCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupCode.trim()) {
      onAdminLogin(groupCode);
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
            <CardTitle>Acesso Admin</CardTitle>
            <CardDescription>
              Digite o código do grupo para acessar como administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupCode">Código do Grupo</Label>
                <Input
                  id="groupCode"
                  placeholder="Digite o código"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !groupCode.trim()}
              >
                {isLoading ? 'Acessando...' : 'Acessar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
