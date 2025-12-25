import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const where: any = { userId: session.user.id }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      where.date = { gte: startDate, lte: endDate }
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Harcamalar getirilirken hata:', error)
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
    const { amount, category, description, receiptUrl, date } = body

    if (!amount || !category || !date) {
      return NextResponse.json(
        { error: 'Amount, category ve date gerekli' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        userId: session.user.id,
        amount,
        category,
        description,
        receiptUrl,
        date: new Date(date),
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Harcama eklenirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
