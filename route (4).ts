export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchTopAgencies } from '@/lib/usaspending';

export async function GET() {
  try {
    // Try fetching from cache first
    let agencies = await prisma.agency.findMany({
      orderBy: { totalObligated: 'desc' },
      take: 20,
    });

    if ((agencies?.length ?? 0) < 5) {
      // Fetch from USASpending API
      const data = await fetchTopAgencies();
      const results = data?.results ?? [];

      for (const agency of results) {
        if (!agency?.toptier_code) continue;
        await prisma.agency.upsert({
          where: { toptierCode: String(agency.toptier_code) },
          update: {
            name: agency?.agency_name ?? 'Unknown',
            abbreviation: agency?.abbreviation ?? null,
            totalObligated: agency?.obligated_amount ?? 0,
            totalBudget: agency?.budget_authority_amount ?? agency?.obligated_amount ?? 0,
            contractCount: agency?.transaction_count ?? 0,
          },
          create: {
            toptierCode: String(agency.toptier_code),
            name: agency?.agency_name ?? 'Unknown',
            abbreviation: agency?.abbreviation ?? null,
            totalObligated: agency?.obligated_amount ?? 0,
            totalBudget: agency?.budget_authority_amount ?? agency?.obligated_amount ?? 0,
            contractCount: agency?.transaction_count ?? 0,
          },
        });
      }

      agencies = await prisma.agency.findMany({
        orderBy: { totalObligated: 'desc' },
        take: 20,
      });
    }

    return NextResponse.json({ agencies: agencies ?? [] });
  } catch (err: any) {
    console.error('Agencies API error:', err?.message ?? err);
    return NextResponse.json({ agencies: [], error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
