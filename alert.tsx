'use client';

import Link from 'next/link';
import {
  Shield, Eye, Code2, Database, Cpu, GitBranch, Heart,
  CheckCircle2, ArrowRight, Rocket, Users, Scale, Target, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GITHUB_URL } from '@/lib/constants';
import { FadeIn, SlideIn, Stagger, StaggerItem, HoverLift } from '@/components/ui/animate';

export function AboutClient() {
  const features = [
    {
      icon: Database,
      title: 'Real Data Integration',
      description: 'Direct integration with USAspending.gov API. Every number comes from official government sources.',
    },
    {
      icon: Cpu,
      title: 'Anomaly Detection',
      description: 'Statistical algorithms detect cost overruns, outliers, duplicate payments, and suspicious patterns automatically.',
    },
    {
      icon: Eye,
      title: 'Transparent Tracking',
      description: 'Track spending across 20+ federal agencies. Drill into individual contracts and awards.',
    },
    {
      icon: Code2,
      title: 'Open Source',
      description: 'Every line of code is public. Fork it, audit it, improve it. This belongs to everyone.',
    },
    {
      icon: Scale,
      title: 'Bounty System',
      description: 'Rewards for verified discoveries of waste, fraud, or inefficiency. Community-validated.',
    },
    {
      icon: Shield,
      title: 'Citizen Powered',
      description: 'No corporate sponsors. No political affiliations. Funded entirely by citizens who care.',
    },
  ];

  const roadmap = [
    { phase: 'Phase 1', title: 'Foundation', status: 'active', items: ['USAspending.gov API integration', 'Basic anomaly detection', 'Agency spending dashboards', 'Donation infrastructure'] },
    { phase: 'Phase 2', title: 'Intelligence', status: 'upcoming', items: ['Machine learning anomaly detection', 'Duplicate payment detection', 'Historical trend analysis', 'Email alerts for new anomalies'] },
    { phase: 'Phase 3', title: 'Community', status: 'upcoming', items: ['User-submitted audits', 'Bounty voting system', 'Community verification', 'Whistleblower protections'] },
    { phase: 'Phase 4', title: 'Scale', status: 'upcoming', items: ['State & local spending data', 'International government data', 'API for researchers', 'Mobile app'] },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
      {/* Hero */}
      <FadeIn>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-xs font-mono">OPEN SOURCE · TRANSPARENT · CITIZEN-POWERED</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            About <span className="text-gradient">WasteWatch</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            WasteWatch is an open-source citizen audit layer that makes government spending visible.
            Built to turn passive taxpayers into active auditors through real data and anomaly detection.
          </p>
        </div>
      </FadeIn>

      {/* Mission */}
      <FadeIn delay={0.1}>
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold mb-2">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The U.S. federal government spends trillions of dollars annually. Most citizens have no way to
                  see where that money goes, let alone identify waste, fraud, or inefficiency. WasteWatch changes that.
                  By connecting directly to official government spending data and applying anomaly detection algorithms,
                  this platform automatically flags suspicious patterns — cost overruns, statistical outliers, and
                  non-competitive awards — making it possible for anyone to be a government auditor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Features */}
      <FadeIn delay={0.15}>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-6 text-center">What WasteWatch Does</h2>
      </FadeIn>
      <Stagger staggerDelay={0.08}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((f: any, idx: number) => (
            <StaggerItem key={idx}>
              <HoverLift>
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{f?.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f?.description}</p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </div>
      </Stagger>

      {/* Roadmap */}
      <FadeIn delay={0.2}>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-6 text-center">Roadmap</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {roadmap.map((phase: any, idx: number) => (
            <Card key={idx} className={phase?.status === 'active' ? 'border-primary/30' : ''}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={phase?.status === 'active' ? 'default' : 'outline'} className="text-xs">
                    {phase?.phase}
                  </Badge>
                  {phase?.status === 'active' && (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <h3 className="font-medium text-sm mb-2">{phase?.title}</h3>
                <ul className="space-y-1.5">
                  {(phase?.items ?? []).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className={`h-3 w-3 shrink-0 mt-0.5 ${phase?.status === 'active' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* Tech Stack */}
      <FadeIn delay={0.25}>
        <Card className="mb-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" /> Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Recharts', 'USAspending.gov API', 'Framer Motion'].map((t: string) => (
                <Badge key={t} variant="secondary" className="text-xs font-mono">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* CTAs */}
      <FadeIn delay={0.3}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <GitBranch className="h-4 w-4" /> Contribute on GitHub
            </Button>
          </a>
          <Link href="/donate">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Heart className="h-4 w-4" /> Fund the Mission
            </Button>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
