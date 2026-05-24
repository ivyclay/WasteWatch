'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, DollarSign, Building2, Calendar, ChevronLeft,
  ChevronRight, ArrowUpDown, FileText, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';

interface Award {
  id: string;
  externalId: string | null;
  awardType: string;
  description: string | null;
  recipientName: string | null;
  awardAmount: number;
  totalOutlays: number;
  startDate: string | null;
  endDate: string | null;
  fundingAgency: string | null;
  agency: { name: string; abbreviation: string | null } | null;
}

export function SpendingClient() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState('awardAmount');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        sort: sortField,
        order: sortOrder,
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/awards?${params}`);
      const data = await res?.json?.();
      setAwards(data?.awards ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setTotal(data?.total ?? 0);
    } catch (err: any) {
      console.error('Failed to fetch awards:', err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortField, sortOrder]);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  const handleSearch = () => {
    setPage(1);
    fetchAwards();
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Spending Explorer</h1>
          <p className="text-muted-foreground">Search and analyze federal contracts and awards from USAspending.gov</p>
        </div>
      </FadeIn>

      {/* Search & Filters */}
      <FadeIn delay={0.1}>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by recipient or description..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e?.key === 'Enter') handleSearch(); }}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" /> Search
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">Total Results: {total}</Badge>
              <Badge variant="secondary" className="text-xs">Sort: {sortField} ({sortOrder})</Badge>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { label: 'Amount', field: 'awardAmount' },
          { label: 'Start Date', field: 'startDate' },
          { label: 'Recipient', field: 'recipientName' },
        ].map((s: any) => (
          <Button
            key={s?.field}
            variant={sortField === s?.field ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort(s?.field)}
            className="gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" /> {s?.label}
          </Button>
        ))}
      </div>

      {/* Awards List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i: number) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (awards?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No awards found. Try a different search or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <Stagger staggerDelay={0.04}>
          <div className="space-y-3">
            {(awards ?? []).map((award: Award, idx: number) => (
              <StaggerItem key={award?.id ?? idx}>
                <Card className="hover:glow-emerald transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-mono shrink-0">
                            {award?.awardType ?? 'N/A'}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono truncate">
                            {award?.externalId ?? award?.id}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate">
                          {award?.recipientName ?? 'Unknown Recipient'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {award?.description ?? 'No description available'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {award?.agency?.name && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" /> {award?.agency?.abbreviation ?? award?.agency?.name}
                            </span>
                          )}
                          {award?.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(award?.startDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-mono font-bold text-primary">
                          {formatCurrency(award?.awardAmount)}
                        </p>
                        {(award?.totalOutlays ?? 0) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Outlayed: {formatCurrency(award?.totalOutlays)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
