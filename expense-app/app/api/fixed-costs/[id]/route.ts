import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, amountMin, amountMax, category, dueDay, isActive } = body

    const fixedCost = await prisma.fixedCost.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        amountMin,
        amountMax,
        category,
        dueDay: dueDay ? parseInt(dueDay) : undefined,
        isActive,
      },
    })

    return NextResponse.json(fixedCost)
  } catch (error) {
    console.error('Sabit gider güncellenirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.fixedCost.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sabit gider silinirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
