import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

//update pour le client
export async function PUT(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError, } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { nom, telephone } = body

    const utilisateur = await prisma.utilisateur.update({
      where: { supabase_user_id: user.id },
      data: {
        nom,
        client: {
          update: {
            telephone,
          },
        },
      },
      include: { client: true },
    })

    return NextResponse.json({ utilisateur })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}