import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingRequests = await prisma.request.findMany({
      where: { status: 'pending' },
      include: { user: true, book: true },
    });
    return NextResponse.json(pendingRequests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
