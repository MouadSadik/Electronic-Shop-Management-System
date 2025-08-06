// app/api/client/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const utilisateur = await prisma.utilisateur.findUnique({
        where: { supabase_user_id: user.id },
    })

    if (!utilisateur) {
        return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
    }
    const client = await prisma.client.findUnique({
        where: { utilisateur_id: utilisateur.id },
    })

    if (!client) {
        return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

  const commandes = await prisma.commande.groupBy({
    by: ['status'],
    where: { client_id: client.id  },
    _count: true,
  });

  const result = {
  LIVREE: 0,
  CONFIRMEE: 0,
  ANNULEE: 0,
  DEVIS: 0,
};

commandes.forEach((cmd) => {
  const status = cmd.status as keyof typeof result;
  if (status in result) {
    result[status] = cmd._count;
  }
});


  return NextResponse.json(result);
}
