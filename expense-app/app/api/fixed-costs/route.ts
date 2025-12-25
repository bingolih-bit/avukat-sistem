import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fixedCosts = await prisma.fixedCost.findMany({
      where: { userId: session.user.id },
      orderBy: { dueDay: 'asc' },
    })

    return NextResponse.json(fixedCosts)
  } catch (error) {
    console.error('Sabit giderler getirilirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, amountMin, amountMax, category, dueDay } = body

    if (!name || !amountMin || !category || !dueDay) {
      return NextResponse.json(
        { error: 'Name, amountMin, category ve dueDay gerekli' },
        { status: 400 }
      )
    }

    const fixedCost = await prisma.fixedCost.create({
      data: {
        userId: session.user.id,
        name,
        amountMin,
        amountMax,
        category,
        dueDay: parseInt(dueDay),
        isActive: true,
      },
    })

    return NextResponse.json(fixedCost)
  } catch (error) {
    console.error('Sabit gider eklenirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
