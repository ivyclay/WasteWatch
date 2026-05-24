export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchSpendingByAward } from '@/lib/usaspending';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const page = parseInt(searchParams?.get('page') ?? '1');
    const limit = parseInt(searchParams?.get('limit') ?? '25');
    const sort = searchParams?.get('sort') ?? 'awardAmount';
    const order = searchParams?.get('order') ?? 'desc';
    const search = searchParams?.get('search') ?? '';

    // Try database first
    const where: any = {};
    if (search) {
      where.OR = [
        { recipientName: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let awards = await prisma.award.findMany({
      where,
      orderBy: { [sort]: order },
      take: limit,
      skip: (page - 1) * limit,
      include: { agency: true },
    });

    const total = await prisma.award.count({ where });

    if ((awards?.length ?? 0) === 0 && !search) {
      // Fetch from API and store
      const data = await fetchSpendingByAward({ page, limit });
      const results = data?.results ?? [];

      for (const r of results) {
        const awardId = r?.['Award ID'];
        if (!awardId) continue;
        
        // Find or create agency
        let agencyId: string | null = null;
        const agencyName = r?.['Awarding Agency'];
        if (agencyName) {
          const existingAgency = await prisma.agency.findFirst({
            where: { name: agencyName },
          });
          agencyId = existingAgency?.id ?? null;
        }

        await prisma.award.upsert({
          where: { externalId: String(awardId) },
          update: {
            awardAmount: r?.['Award Amount'] ?? 0,
            totalOutlays: r?.['Total Outlays'] ?? 0,
          },
          create: {
            externalId: String(awardId),
            awardType: r?.['Contract Award Type'] ?? 'CONTRACT',
            recipientName: r?.['Recipient Name'] ?? null,
            description: r?.['Description'] ?? null,
            awardAmount: r?.['Award Amount'] ?? 0,
            totalOutlays: r?.['Total Outlays'] ?? 0,
            startDate: r?.['Start Date'] ? new Date(r['Start Date']) : null,
            endDate: r?.['End Date'] ? new Date(r['End Date']) : null,
            fundingAgency: r?.['Funding Agency'] ?? null,
            agencyId,
          },
        });
      }

      awards = await prisma.award.findMany({
        orderBy: { [sort]: order },
        take: limit,
        skip: (page - 1) * limit,
        include: { agency: true },
      });
    }

    return NextResponse.json({
      awards: awards ?? [],
      total: total ?? 0,
      page,
      limit,
      totalPages: Math.ceil((total ?? 0) / limit),
    });
  } catch (err: any) {
    console.error('Awards API error:', err?.message ?? err);
    return NextResponse.json({ awards: [], total: 0, page: 1, limit: 25, totalPages: 0, error: err?.message }, { status: 500 });
  }
}
