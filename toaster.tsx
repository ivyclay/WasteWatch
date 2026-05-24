'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Zap, Bitcoin, Wallet, Copy, Check, Shield, Target,
  Award, Users, ArrowRight, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DONATION_ADDRESSES, GITHUB_URL } from '@/lib/constants';
import { FadeIn, SlideIn, Stagger, StaggerItem, HoverLift } from '@/components/ui/animate';
import { toast } from 'sonner';

export function DonateClient() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator?.clipboard?.writeText?.(text);
      setCopiedField(field);
      toast?.success?.('Address copied to clipboard!');
      setTimeout(() => setCopiedField(null), 3000);
    } catch {
      toast?.error?.('Failed to copy');
    }
  };

  const donationOptions = [
    {
      icon: Zap,
      label: 'Lightning Network',
      description: 'Instant, near-zero fee Bitcoin payments',
      address: DONATION_ADDRESSES?.lightning ?? '',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: Bitcoin,
      label: 'Bitcoin (BTC)',
      description: 'On-chain Bitcoin donation',
      address: DONATION_ADDRESSES?.btc ?? '',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      icon: Wallet,
      label: 'Ethereum (ETH)',
      description: 'ETH or ERC-20 tokens',
      address: DONATION_ADDRESSES?.eth ?? '',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  ];

  const milestones = [
    { amount: '$5K', label: 'Cover server costs & API access', reached: false },
    { amount: '$25K', label: 'First bounty pool for verified waste discoveries', reached: false },
    { amount: '$100K', label: 'Full-time analyst team & advanced ML detection', reached: false },
    { amount: '$500K', label: 'State-level spending integration & legal fund', reached: false },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
      {/* Hero */}
      <FadeIn>
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Fund Government <span className="text-gradient">Accountability</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every donation directly funds the bounty pool — rewards for citizens who verify and document
            government waste, fraud, and inefficiency. This is civic oversight powered by the people.
          </p>
        </div>
      </FadeIn>

      {/* How It Works */}
      <FadeIn delay={0.1}>
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> How Donations Work
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: 'Transparent Treasury', desc: 'All funds tracked on-chain. Every satoshi is accountable.' },
                { icon: Award, title: 'Bounty Pool', desc: 'Rewards for verified waste/fraud reports. Community-validated discoveries.' },
                { icon: Users, title: 'Open Governance', desc: 'Token holders vote on bounty allocation. Fully decentralized oversight.' },
              ].map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{item?.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item?.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Donation Addresses */}
      <Stagger staggerDelay={0.1}>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {donationOptions.map((option: any, idx: number) => (
            <StaggerItem key={idx}>
              <HoverLift>
                <Card className={`h-full ${option?.borderColor}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${option?.bgColor}`}>
                        <option.icon className={`h-5 w-5 ${option?.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{option?.label}</p>
                        <p className="text-xs text-muted-foreground">{option?.description}</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-mono break-all text-muted-foreground">
                        {option?.address}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => copyToClipboard(option?.address ?? '', option?.label ?? '')}
                    >
                      {copiedField === option?.label ? (
                        <><Check className="h-3 w-3" /> Copied!</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copy Address</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </div>
      </Stagger>

      {/* Treasury Status */}
      <FadeIn delay={0.2}>
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Treasury Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Raised</p>
                <p className="text-2xl font-mono font-bold text-primary">$0</p>
                <p className="text-xs text-muted-foreground">Just getting started</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bounty Pool</p>
                <p className="text-2xl font-mono font-bold">$0</p>
                <p className="text-xs text-muted-foreground">Available for bounties</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bounties Paid</p>
                <p className="text-2xl font-mono font-bold">0</p>
                <p className="text-xs text-muted-foreground">Rewards distributed</p>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <p className="text-sm font-medium mb-3">Funding Milestones</p>
              <div className="space-y-2">
                {milestones.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg">
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${m?.reached ? 'border-primary bg-primary/20' : 'border-border'}`}>
                      {m?.reached && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm">{m?.label}</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">{m?.amount}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.25}>
        <Card className="border-primary/20">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-display font-bold mb-2">Prefer to contribute code?</p>
            <p className="text-sm text-muted-foreground mb-4">
              WasteWatch is open-source. Star the repo, submit PRs, or report issues.
            </p>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                Star on GitHub <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
