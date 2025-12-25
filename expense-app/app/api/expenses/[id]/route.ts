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
    const { amount, category, description, receiptUrl, date } = body

    const expense = await prisma.expense.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        amount,
        category,
        description,
        receiptUrl,
        date: date ? new Date(date) : undefined,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Harcama güncellenirken hata:', error)
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

    await prisma.expense.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Harcama silinirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
