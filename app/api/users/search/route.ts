import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ users: [] })

  // Exclude: self + already shared (passed as comma-separated excludeIds)
  const excludeRaw = request.nextUrl.searchParams.get('exclude') ?? ''
  const excludeIds = [
    session.user.id,
    ...excludeRaw.split(',').filter(Boolean),
  ]

  const users = await db.user.findMany({
    where: {
      AND: [
        { id: { notIn: excludeIds } },
        {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        },
      ],
    },
    select: { id: true, name: true, email: true, image: true },
    take: 10,
  })

  return NextResponse.json({ users })
}
