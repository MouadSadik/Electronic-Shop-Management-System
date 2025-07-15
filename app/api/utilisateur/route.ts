import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

//get pour utilisateur(client ou bien admin)
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError, } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { supabase_user_id: user.id },
      include: { client: true },
    })

    if (!utilisateur) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ utilisateur })
  } catch (err) {
    console.error('Erreur API:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}