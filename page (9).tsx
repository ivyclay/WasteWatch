export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchTopAgencies, fetchSpendingByAward } from '@/lib/usaspending';
import { runAllDetectors } from '@/lib/anomaly-detection';

export async function POST() {
  try {
    const results: string[] = [];

    // Step 1: Fetch and store top agencies
    results.push('Fetching agencies from USAspending.gov...');
    const agencyData = await fetchTopAgencies();
    const agencies = agencyData?.results ?? [];
    let agencyCount = 0;

    for (const agency of agencies) {
      if (!agency?.toptier_code) continue;
      try {
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
        agencyCount++;
      } catch (e: any) {
        console.error(`Failed to upsert agency ${agency?.toptier_code}:`, e?.message);
      }
    }
    results.push(`Stored ${agencyCount} agencies.`);

    // Step 2: Fetch and store recent awards (multiple pages)
    results.push('Fetching recent awards...');
    let totalAwards = 0;

    for (let page = 1; page <= 4; page++) {
      try {
        const data = await fetchSpendingByAward({ page, limit: 50 });
        const awards = data?.results ?? [];
        if (awards.length === 0) break;

        for (const r of awards) {
          const awardId = r?.['Award ID'];
          if (!awardId) continue;

          let agencyId: string | null = null;
          const agencyName = r?.['Awarding Agency'];
          if (agencyName) {
            const existingAgency = await prisma.agency.findFirst({ where: { name: agencyName } });
            agencyId = existingAgency?.id ?? null;
          }

          try {
            await prisma.award.upsert({
              where: { externalId: String(awardId) },
              update: {
                awardAmount: r?.['Award Amount'] ?? 0,
                totalOutlays: r?.['Total Outlays'] ?? 0,
              },
              create: {
                externalId: String(awardId),
                awardType: r?.['Contract Award Type'] ?? r?.['Award Type'] ?? 'CONTRACT',
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
            totalAwards++;
          } catch (e: any) {
            // Skip duplicates or errors
          }
        }
      } catch (e: any) {
        console.error(`Failed to fetch awards page ${page}:`, e?.message);
      }
    }
    results.push(`Stored ${totalAwards} awards.`);

    // Step 3: Run anomaly detection on all stored awards
    results.push('Running anomaly detection...');
    const allAwards = await prisma.award.findMany({
      include: { agency: true },
      orderBy: { awardAmount: 'desc' },
      take: 200,
    });

    const detected = runAllDetectors(allAwards);
    let anomalyCount = 0;

    for (const a of detected) {
      const existingAnomaly = await prisma.anomaly.findFirst({ where: { title: a.title } });
      if (existingAnomaly) continue;

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

      try {
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
        anomalyCount++;
      } catch (e: any) {
        // Skip if already exists
      }
    }
    results.push(`Detected ${anomalyCount} new anomalies.`);

    // Get final counts
    const finalStats = {
      agencies: await prisma.agency.count(),
      awards: await prisma.award.count(),
      anomalies: await prisma.anomaly.count(),
    };

    return NextResponse.json({
      success: true,
      message: 'Data ingestion complete',
      log: results,
      stats: finalStats,
    });
  } catch (err: any) {
    console.error('Ingestion error:', err?.message ?? err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
