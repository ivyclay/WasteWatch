# 🔍 WasteWatch

**Making Government Spending Visible.**

An open-source citizen audit layer for U.S. federal spending. WasteWatch pulls real data from USAspending.gov, runs anomaly detection algorithms, and presents findings in a clean, searchable dashboard — so taxpayers can see exactly where the money goes and where it shouldn't.

[![Live Demo](https://img.shields.io/badge/Live-wastewatch.abacusai.app-10B981?style=for-the-badge)](https://wastewatch.abacusai.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Built With](https://img.shields.io/badge/Built_With-Next.js_14-black?style=for-the-badge)](https://nextjs.org)

---

## 🎯 Why This Exists

The U.S. federal government spends over **$6 trillion per year**. Most of it is buried in databases that are technically public but practically invisible to citizens.

WasteWatch exists because:

- **$247 billion** in improper payments were identified by the GAO in a single year
- Cost overruns on major defense contracts routinely exceed 20-50%
- Sole-source contracts worth billions bypass competitive bidding with minimal oversight
- Existing transparency tools are fragmented, slow, and not designed for adversarial auditing

**We believe every dollar of public money deserves a public eye on it.**

---

## ⚡ Features

### Live Dashboard
- Real-time stats from USAspending.gov API
- Interactive charts showing agency spending breakdowns
- Anomaly severity distribution visualizations

### Spending Explorer
- Search and filter 200+ federal contracts and awards
- Sort by amount, date, or recipient
- Paginated results with detailed breakdowns

### Anomaly Detection Engine
- **Cost Overrun Detection** — Flags awards where outlays exceed the original amount by 15%+
- **Statistical Outlier Detection** — Identifies awards 3+ standard deviations above the mean
- **Non-Competitive Award Detection** — Catches sole-source and no-bid contracts over $500K
- Severity classification: CRITICAL / HIGH / MEDIUM / LOW

### Agency Tracker
- Top 20+ federal agencies ranked by spending
- Budget vs. obligated amount comparisons
- Contract volume metrics

### Open Donations
- Lightning Network (Bitcoin)
- On-chain BTC
- ETH / USDC
- Transparent treasury status tracking

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                 Frontend                     │
│         Next.js 14 + Tailwind CSS           │
│         Recharts + Framer Motion            │
├─────────────────────────────────────────────┤
│                 API Layer                    │
│         /api/stats                          │
│         /api/agencies                       │
│         /api/awards                         │
│         /api/anomalies                      │
│         /api/ingest                         │
├─────────────────────────────────────────────┤
│              Detection Engine                │
│    Cost Overruns • Outliers • No-Compete    │
├─────────────────────────────────────────────┤
│              Data Sources                    │
│    USAspending.gov API v2 → PostgreSQL      │
└─────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Yarn

### Installation

```bash
git clone https://github.com/ivyclay/WasteWatch.git
cd WasteWatch
yarn install
```

### Environment Setup

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wastewatch"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

### Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Ingest Real Data

Once the server is running, trigger data ingestion:

```bash
curl -X POST http://localhost:3000/api/ingest
```

This fetches real agency and award data from USAspending.gov and runs anomaly detection.

---

## 📊 Data Sources

| Source | Endpoint | Data |
|--------|----------|------|
| USAspending.gov | `/api/v2/references/toptier_agencies/` | Agency budgets & obligations |
| USAspending.gov | `/api/v2/search/spending_by_award/` | Contract awards & outlays |
| Seed Data | `scripts/seed.ts` | Notable contracts (F-35, B-21, VA EHRM) |

---

## 🔬 Anomaly Detection

### Cost Overrun Detector
Flags awards where `totalOutlays > awardAmount × 1.15`
- CRITICAL: >50% overrun
- HIGH: >25% overrun
- MEDIUM: >15% overrun

### Statistical Outlier Detector
Identifies awards >3σ above the mean award amount
- Only flags awards >$1M to reduce noise

### Non-Competitive Award Detector
Searches descriptions for sole-source indicators
- Flags awards >$500K with no-bid language

---

## 🗺️ Roadmap

### Phase 1 — MVP ✅ (Current)
- [x] Live dashboard with real USAspending.gov data
- [x] Anomaly detection engine (cost overruns, outliers, no-compete)
- [x] Spending explorer with search and pagination
- [x] Agency tracker with top 20+ agencies
- [x] Donation page (Lightning, BTC, ETH)

### Phase 2 — On-Chain Accountability
- [ ] Smart contract treasury on Arbitrum (multisig governance)
- [ ] Immutable audit report anchoring (IPFS + on-chain hash)
- [ ] Bounty system for verified waste discoveries
- [ ] Lightning Network webhook integration for automated payouts

### Phase 3 — ZK Privacy Layer
- [ ] Zero-knowledge proof tip submission (circom/Halo2)
- [ ] Anonymous whistleblower protection
- [ ] Encrypted tip verification pipeline

### Phase 4 — Scale
- [ ] State-level spending data
- [ ] International government spending
- [ ] Community forks for local municipalities
- [ ] DAO governance for bounty pool management

---

## 💰 Fund the Mission

WasteWatch is 100% open source and community funded. Donations go directly to the bounty pool — rewards for verified waste, fraud, and inefficiency discoveries.

| Method | Address |
|--------|---------|
| ⚡ Lightning | `wastewatch@getalby.com` |
| ₿ Bitcoin | `bc1qwastewatch000000000000000000000000demo` |
| Ξ ETH/USDC | `0xWasteWatch0000000000000000000000000Demo` |

> ⚠️ **These are demo addresses.** Replace with your real wallet addresses in `lib/constants.ts` before accepting donations.

---

## 🤝 Contributing

We welcome contributions from developers, data analysts, policy researchers, and anyone who believes in government accountability.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/new-detector`)
3. Commit changes (`git commit -m 'Add duplicate payment detection'`)
4. Push to branch (`git push origin feature/new-detector`)
5. Open a Pull Request

### Priority Areas
- New anomaly detection algorithms (duplicate payments, round-number detection, vendor concentration)
- Historical trend analysis
- Data visualization improvements
- Documentation and educational content

---

## 🛡️ Philosophy

> "Sunlight is the best disinfectant." — Louis Brandeis

WasteWatch is built on three principles:
1. **Sovereignty** — No government should be able to censor or shut down citizen auditing
2. **Transparency** — All code, data, and funding flows are public
3. **Incentive Alignment** — People who find waste should be rewarded for it

---

## 📄 License

MIT — Use it, fork it, deploy it for your own government. That's the point.

---

## 🔗 Links

- **Live Demo:** [wastewatch.abacusai.app](https://wastewatch.abacusai.app)
- **GitHub:** [github.com/ivyclay/WasteWatch](https://github.com/ivyclay/WasteWatch)
- **Data Source:** [USAspending.gov](https://www.usaspending.gov)
- **API Docs:** [api.usaspending.gov](https://api.usaspending.gov)

---

Built with conviction. Ship fast. Make waste visible.
