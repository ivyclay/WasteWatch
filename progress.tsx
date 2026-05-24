'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Zap, ShieldAlert, CircleDollarSign, Filter,
  Eye, TrendingUp, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeverityBadge } from '@/components/severity-badge';
import { StatCard } from '@/components/stat-card';
import { AnomalySeverityChart } from '@/components/charts/anomaly-severity-chart';
import { formatCompactCurrency, timeAgo } from '@/lib/format';
import { ANOMALY_TYPES } from '@/lib/constants';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';

export function AnomaliesClient() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, critical: 0, high: 0, medium: 0 });
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (filterSeverity) params.set('severity', filterSeverity);
        if (filterType) params.set('type', filterType);
        const res = await fetch(`/api/anomalies?${params}`);
        const data = await res?.json?.();
        setAnomalies(data?.anomalies ?? []);
        setCounts(data?.counts ?? { total: 0, critical: 0, high: 0, medium: 0 });
      } catch (err: any) {
        console.error('Failed to load anomalies:', err?.message ?? err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filterSeverity, filterType]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-orange-500" />
            Anomaly Dashboard
          </h1>
          <p className="text-muted-foreground">Automated detection of cost overruns, statistical outliers, and suspicious spending patterns</p>
        </div>
      </FadeIn>

      {/* Stats */}
      <Stagger staggerDelay={0.08}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem>
            <StatCard title="Total Open" value={counts?.total ?? 0} icon={AlertTriangle} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Critical" value={counts?.critical ?? 0} icon={Zap} className="border-red-500/20" />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="High" value={counts?.high ?? 0} icon={TrendingUp} className="border-orange-500/20" />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Medium" value={counts?.medium ?? 0} icon={Eye} className="border-yellow-500/20" />
          </StaggerItem>
        </div>
      </Stagger>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Severity Chart */}
        <FadeIn>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Severity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <AnomalySeverityChart counts={counts} />
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Severity</p>
                <div className="flex flex-wrap gap-2">
                  {['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s: string) => (
                    <Button
                      key={s}
                      variant={filterSeverity === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterSeverity(s)}
                      className="text-xs"
                    >
                      {s || 'All'}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Type</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterType === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('')}
                    className="text-xs"
                  >
                    All
                  </Button>
                  {Object.entries(ANOMALY_TYPES ?? {}).map(([key, label]: [string, string]) => (
                    <Button
                      key={key}
                      variant={filterType === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(key)}
                      className="text-xs"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Anomaly Feed */}
      <FadeIn delay={0.15}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Detection Feed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map((i: number) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : (anomalies?.length ?? 0) === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No anomalies match your filters. Adjust filters or wait for new detections.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(anomalies ?? []).map((anomaly: any, idx: number) => (
                  <motion.div
                    key={anomaly?.id ?? idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors border border-transparent hover:border-border/40"
                  >
                    <SeverityBadge severity={anomaly?.severity ?? 'INFO'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{anomaly?.title ?? 'Unknown'}</p>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {ANOMALY_TYPES[anomaly?.type as string] ?? anomaly?.type ?? 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{anomaly?.description ?? ''}</p>
                      {anomaly?.agency?.name && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <CircleDollarSign className="h-3 w-3" /> {anomaly?.agency?.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono font-bold text-primary">{formatCompactCurrency(anomaly?.amount)}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(anomaly?.detectedAt ?? anomaly?.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
