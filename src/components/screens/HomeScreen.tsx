import { Gift, Sparkles, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { HomeScreenProps } from '@/types';

export function HomeScreen({ onCreate, onAdminAccess }: HomeScreenProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-primary/10">
            <Gift className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Amigo Secreto
          </h1>
          <p className="text-lg text-muted-foreground">
            Celebrações organizadas sem confusão
          </p>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Button
              onClick={onCreate}
              size="lg"
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Criar Novo Grupo
            </Button>
            <Button
              onClick={onAdminAccess}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Área do Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
