export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [agencyCount, awardCount, anomalyCount, totalSpending, topAnomalies, recentAwards] = await Promise.all([
      prisma.agency.count(),
      prisma.award.count(),
      prisma.anomaly.count({ where: { status: 'OPEN' } }),
      prisma.award.aggregate({ _sum: { awardAmount: true } }),
      prisma.anomaly.findMany({
        where: { status: 'OPEN' },
        orderBy: { amount: 'desc' },
        take: 5,
        include: { agency: true },
      }),
      prisma.award.findMany({
        orderBy: { awardAmount: 'desc' },
        take: 5,
        include: { agency: true },
      }),
    ]);

    return NextResponse.json({
      agencyCount: agencyCount ?? 0,
      awardCount: awardCount ?? 0,
      anomalyCount: anomalyCount ?? 0,
      totalSpending: totalSpending?._sum?.awardAmount ?? 0,
      topAnomalies: topAnomalies ?? [],
      recentAwards: recentAwards ?? [],
    });
  } catch (err: any) {
    console.error('Stats API error:', err?.message ?? err);
    return NextResponse.json({
      agencyCount: 0, awardCount: 0, anomalyCount: 0,
      totalSpending: 0, topAnomalies: [], recentAwards: [],
    }, { status: 500 });
  }
}
