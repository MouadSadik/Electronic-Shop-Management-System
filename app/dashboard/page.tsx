'use client';

import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PackageCheck, PackageX, Clock, Truck } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const icons = {
  LIVREE: <Truck className="text-success" />,
  CONFIRMEE: <PackageCheck className="text-primary" />,
  ANNULEE: <PackageX className="text-destructive" />,
  EN_ATTENTE: <Clock className="text-secondary" />,
};

export default function DashboardClient() {
  const { data, error, isLoading } = useSWR('/api/profile/stats', fetcher);

  if (error) return <div className="text-red-500">Erreur de chargement</div>;

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="animate-spin text-muted" />
                Chargement...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statutLabels = {
    LIVREE: 'Livrées',
    CONFIRMEE: 'Confirmées',
    ANNULEE: 'Annulées',
    DEVIS: 'Devis',
  };

  return (
    <div>
      <h1 className='mt-10 font-bold text-primary text-xl'>Bonjour</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {Object.keys(statutLabels).map((statut) => (
          <Card key={statut} className="shadow-md">
            <CardHeader className="flex items-center gap-2">
              {icons[statut as keyof typeof icons]}
              <CardTitle className="text-lg">{statutLabels[statut as keyof typeof statutLabels]}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="text-base px-3 py-1 rounded-xl">
                {data[statut]} commandes
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
