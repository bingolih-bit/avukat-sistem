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

    const income = await prisma.income.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Gelirler getirilirken hata:', error)
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
    const { amount, source, description, date, isRecurring } = body

    if (!amount || !source || !date) {
      return NextResponse.json(
        { error: 'Amount, source ve date gerekli' },
        { status: 400 }
      )
    }

    const income = await prisma.income.create({
      data: {
        userId: session.user.id,
        amount,
        source,
        description,
        date: new Date(date),
        isRecurring: isRecurring || false,
      },
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Gelir eklenirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
