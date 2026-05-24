'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, DollarSign, FileText, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpendingByAgencyChart } from '@/components/charts/spending-by-agency-chart';
import { formatCurrency, formatCompactCurrency, formatNumber } from '@/lib/format';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { StatCard } from '@/components/stat-card';

interface Agency {
  id: string;
  toptierCode: string;
  name: string;
  abbreviation: string | null;
  totalBudget: number;
  totalObligated: number;
  contractCount: number;
}

export function AgenciesClient() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'totalObligated' | 'contractCount' | 'name'>('totalObligated');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/agencies');
        const data = await res?.json?.();
        setAgencies(data?.agencies ?? []);
      } catch (err: any) {
        console.error('Failed to load agencies:', err?.message ?? err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sorted = [...(agencies ?? [])].sort((a: Agency, b: Agency) => {
    if (sortField === 'name') return (a?.name ?? '').localeCompare(b?.name ?? '');
    return (b?.[sortField] ?? 0) - (a?.[sortField] ?? 0);
  });

  const totalObligated = (agencies ?? []).reduce((s: number, a: Agency) => s + (a?.totalObligated ?? 0), 0);
  const totalBudget = (agencies ?? []).reduce((s: number, a: Agency) => s + (a?.totalBudget ?? 0), 0);

  const chartData = sorted.map((a: Agency) => ({
    name: a?.name ?? 'Unknown',
    amount: a?.totalObligated ?? 0,
    abbreviation: a?.abbreviation ?? null,
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Federal Agencies
          </h1>
          <p className="text-muted-foreground">Top federal agencies by spending, pulled from USAspending.gov data</p>
        </div>
      </FadeIn>

      {/* Summary Stats */}
      <Stagger staggerDelay={0.08}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StaggerItem>
            <StatCard title="Agencies Tracked" value={agencies?.length ?? 0} icon={Building2} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Total Obligated" value={totalObligated} prefix="$" icon={DollarSign} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Budget Authority" value={totalBudget} prefix="$" icon={TrendingUp} />
          </StaggerItem>
        </div>
      </Stagger>

      {/* Agency Chart */}
      <FadeIn delay={0.1}>
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Spending by Agency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {loading ? (
                <div className="flex items-center justify-center h-full"><div className="animate-pulse text-sm text-muted-foreground">Loading chart...</div></div>
              ) : (
                <SpendingByAgencyChart data={chartData} />
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4">
        {[
          { label: 'By Spending', field: 'totalObligated' as const },
          { label: 'By Awards', field: 'contractCount' as const },
          { label: 'By Name', field: 'name' as const },
        ].map((s: any) => (
          <Button
            key={s?.field}
            variant={sortField === s?.field ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortField(s?.field)}
            className="gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" /> {s?.label}
          </Button>
        ))}
      </div>

      {/* Agency List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i: number) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <Stagger staggerDelay={0.04}>
          <div className="space-y-3">
            {sorted.map((agency: Agency, idx: number) => {
              const pct = totalObligated > 0 ? ((agency?.totalObligated ?? 0) / totalObligated * 100) : 0;
              return (
                <StaggerItem key={agency?.id ?? idx}>
                  <Card className="hover:glow-emerald transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{agency?.name ?? 'Unknown'}</p>
                            {agency?.abbreviation && (
                              <Badge variant="outline" className="text-[10px] font-mono">{agency.abbreviation}</Badge>
                            )}
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                            <span>{pct.toFixed(1)}% of total</span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" /> {formatNumber(agency?.contractCount)} awards
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-mono font-bold text-primary">
                            {formatCompactCurrency(agency?.totalObligated)}
                          </p>
                          <p className="text-xs text-muted-foreground">obligated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </div>
        </Stagger>
      )}
    </div>
  );
}
