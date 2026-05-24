export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchSpendingByAward } from '@/lib/usaspending';
import { runAllDetectors } from '@/lib/anomaly-detection';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const severity = searchParams?.get('severity') ?? '';
    const type = searchParams?.get('type') ?? '';
    const limit = parseInt(searchParams?.get('limit') ?? '50');

    // Check if we have anomalies in DB
    const where: any = { status: 'OPEN' };
    if (severity) where.severity = severity;
    if (type) where.type = type;

    let anomalies = await prisma.anomaly.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      take: limit,
      include: { agency: true, award: true },
    });

    // If no anomalies, run detection on recent awards
    if ((anomalies?.length ?? 0) === 0) {
      const data = await fetchSpendingByAward({ limit: 100 });
      const awards = data?.results ?? [];
      const detected = runAllDetectors(awards);

      for (const a of detected) {
        let agencyId: string | null = null;
        if (a?.agencyName) {
          const agency = await prisma.agency.findFirst({ where: { name: a.agencyName } });
          agencyId = agency?.id ?? null;
        }

        let awardDbId: string | null = null;
        if (a?.awardId) {
          const award = await prisma.award.findFirst({ where: { externalId: String(a.awardId) } });
          awardDbId = award?.id ?? null;
        }

        await prisma.anomaly.create({
          data: {
            type: a?.type ?? 'UNKNOWN',
            severity: a?.severity ?? 'MEDIUM',
            title: a?.title ?? 'Unknown Anomaly',
            description: a?.description ?? '',
            amount: a?.amount ?? 0,
            agencyId,
            awardId: awardDbId,
            metadata: a?.metadata ?? null,
          },
        });
      }

      anomalies = await prisma.anomaly.findMany({
        where,
        orderBy: { detectedAt: 'desc' },
        take: limit,
        include: { agency: true, award: true },
      });
    }

    const counts = {
      total: await prisma.anomaly.count({ where: { status: 'OPEN' } }),
      critical: await prisma.anomaly.count({ where: { status: 'OPEN', severity: 'CRITICAL' } }),
      high: await prisma.anomaly.count({ where: { status: 'OPEN', severity: 'HIGH' } }),
      medium: await prisma.anomaly.count({ where: { status: 'OPEN', severity: 'MEDIUM' } }),
    };

    return NextResponse.json({ anomalies: anomalies ?? [], counts });
  } catch (err: any) {
    console.error('Anomalies API error:', err?.message ?? err);
    return NextResponse.json({ anomalies: [], counts: { total: 0, critical: 0, high: 0, medium: 0 }, error: err?.message }, { status: 500 });
  }
}
