'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, DollarSign, Building2, Eye, ArrowRight,
  TrendingUp, Search, Zap, Users, Heart, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { SeverityBadge } from '@/components/severity-badge';
import { SpendingByAgencyChart } from '@/components/charts/spending-by-agency-chart';
import { AnomalySeverityChart } from '@/components/charts/anomaly-severity-chart';
import { formatCompactCurrency, timeAgo } from '@/lib/format';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';

interface Stats {
  agencyCount: number;
  awardCount: number;
  anomalyCount: number;
  totalSpending: number;
  topAnomalies: any[];
  recentAwards: any[];
}

interface AnomalyData {
  anomalies: any[];
  counts: { total: number; critical: number; high: number; medium: number };
}

interface AgencyData {
  agencies: any[];
}

export function HomepageClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [anomalyData, setAnomalyData] = useState<AnomalyData | null>(null);
  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, anomaliesRes, agenciesRes] = await Promise.all([
          fetch('/api/stats').then(r => r?.json?.()).catch(() => null),
          fetch('/api/anomalies?limit=10').then(r => r?.json?.()).catch(() => null),
          fetch('/api/agencies').then(r => r?.json?.()).catch(() => null),
        ]);
        setStats(statsRes);
        setAnomalyData(anomaliesRes);
        setAgencyData(agenciesRes);
      } catch (err: any) {
        console.error('Failed to load homepage data:', err?.message ?? err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const agencyChartData = (agencyData?.agencies ?? []).map((a: any) => ({
    name: a?.name ?? 'Unknown',
    amount: a?.totalObligated ?? 0,
    abbreviation: a?.abbreviation ?? null,
  }));

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 sm:py-24 relative">
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 border border-primary/20">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono font-medium text-primary">LIVE MONITORING</span>
              </div>
            </div>
          </FadeIn>

          <SlideIn from="bottom">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              Making Government<br />
              Spending <span className="text-gradient">Visible</span>
            </h1>
          </SlideIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              An open-source citizen audit layer that tracks federal contracts, detects anomalies,
              and turns passive taxpayers into active auditors. Powered by real USAspending.gov data.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Link href="/spending">
                <Button size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Explore Spending
                </Button>
              </Link>
              <Link href="/anomalies">
                <Button variant="outline" size="lg" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  View Anomalies
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Fund the Mission
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
        <Stagger staggerDelay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <StatCard
                title="Total Tracked"
                value={stats?.totalSpending ?? 0}
                prefix="$"
                icon={DollarSign}
                description="Federal spending monitored"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Agencies"
                value={stats?.agencyCount ?? 0}
                icon={Building2}
                description="Federal agencies tracked"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Awards Analyzed"
                value={stats?.awardCount ?? 0}
                icon={Eye}
                description="Contracts & grants reviewed"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Anomalies Found"
                value={stats?.anomalyCount ?? 0}
                icon={AlertTriangle}
                description="Issues detected by algorithms"
                className="border-destructive/20"
              />
            </StaggerItem>
          </div>
        </Stagger>
      </section>

      {/* Charts Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <FadeIn className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Top Agency Spending
                  </CardTitle>
                  <Link href="/agencies">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      View All <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full"><div className="animate-pulse text-sm text-muted-foreground">Loading chart data...</div></div>
                  ) : (
                    <SpendingByAgencyChart data={agencyChartData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Anomaly Severity
                  </CardTitle>
                  <Link href="/anomalies">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      Details <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full"><div className="animate-pulse text-sm text-muted-foreground">Loading...</div></div>
                  ) : (
                    <AnomalySeverityChart counts={anomalyData?.counts ?? { critical: 0, high: 0, medium: 0 }} />
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Recent Anomalies Feed */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-10">
        <FadeIn>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Recent Anomaly Detections
                </CardTitle>
                <Link href="/anomalies">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    See All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map((i: number) => (
                    <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (anomalyData?.anomalies?.length ?? 0) === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No anomalies detected yet. Data will populate as awards are analyzed.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(anomalyData?.anomalies ?? []).slice(0, 8).map((anomaly: any, idx: number) => (
                    <motion.div
                      key={anomaly?.id ?? idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <SeverityBadge severity={anomaly?.severity ?? 'INFO'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{anomaly?.title ?? 'Unknown anomaly'}</p>
                        <p className="text-xs text-muted-foreground truncate">{anomaly?.description ?? ''}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-mono font-semibold text-primary">{formatCompactCurrency(anomaly?.amount)}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(anomaly?.detectedAt ?? anomaly?.createdAt)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-16">
        <FadeIn>
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" />
            <CardContent className="relative py-10 px-6 sm:px-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display text-xl font-bold tracking-tight mb-1">Help Fund Government Accountability</h3>
                  <p className="text-sm text-muted-foreground max-w-lg">
                    Donations fund the bounty pool — rewards for verified waste, fraud, and inefficiency discoveries.
                    Every contribution strengthens civic oversight.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href="/donate">
                    <Button size="lg" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Donate Now
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="gap-2">
                      Learn More <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}
