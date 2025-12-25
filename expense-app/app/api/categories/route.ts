import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const where = type ? { type } : {}

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
