# NodeDrops.xyz

> **Run Nodes. Learn Web3. Explore Opportunities.**

NodeDrops.xyz is a production-oriented blockchain node education, discovery, and infrastructure tooling platform built for both beginners learning DevOps fundamentals and advanced validators operating multi-region infrastructure.

---

## 🌟 Key Platform Features

### 1. Interactive Operator Tools Suite
- **Node Hardware Checker (`/tools/hardware-checker`):** Enter custom CPU cores, RAM, NVMe storage, and network bandwidth to test compatibility against database-backed network profiles with instant verdicts and component breakdowns.
- **Node Command Builder (`/tools/command-builder`):** Generate tested systemd service units, Docker Compose definitions, and initialization commands from versioned templates with safety warnings and root privilege alerts.
- **Node Setup Checklist (`/tools/checklist`):** Browser-local (`localStorage`) persistent checklist guiding operators through SSH hardening, firewall isolation, swap creation, and key backup with zero server-side tracking.
- **Troubleshooting Hub (`/troubleshooting`):** Searchable diagnostic runbooks covering disk space exhaustion, zero peer sync, JWT engine auth errors, and RPC port conflicts.

### 2. Comprehensive Directory & Education
- **Blockchain Network Registry (`/networks` & `/networks/[slug]`):** Hardware specs (min vs recommended), client pairings, chain IDs, and official documentation links.
- **Step-by-Step Technical Guides (`/guides` & `/guides/[slug]`):** Field-tested walkthroughs with copyable terminal blocks, expected outputs, security warnings, and community feedback.
- **Node Operator Opportunities (`/opportunities` & `/opportunities/[slug]`):** Verified tracking for incentivized testnets and validator campaigns with clear reward status and anti-scam warnings.
- **Beginner Infrastructure Curriculum (`/learn`):** Structured onboarding covering VPS leasing, Ed25519 SSH keys, UFW firewalls, and systemd automation.

### 3. Mission Control Admin Panel (`/admin`)
- **Dashboard Telemetry:** Real-time metrics for published guides, drafts, networks, active campaigns, and visual documentation telemetry charts matching reference dashboard designs.
- **Guide Management (`/admin/guides`):** Author, preview, edit, version, and publish technical guides with Markdown editing and step builders.
- **Security & Content Audit Logs (`/admin/audit-logs`):** Tamper-evident log of administrative operations, logins, and status transitions without sensitive credential leakage.
- **User & Role Administration (`/admin/users`):** Contributor and editor management with safeguard against removing the last active administrator.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server Components, Server Actions, Route Handlers, ISR |
| **Language** | TypeScript | Strict type checking (`strict: true`) across the codebase |
| **Styling** | Tailwind CSS | Dark Web3 theme (`#080B14`, `#101525`, `#141B2D`, neon violet & cyan) |
| **Database** | TiDB Cloud Starter / MySQL | Relational schema with TLS connection pooling |
| **ORM** | Prisma ORM | 18 normalized models, foreign keys, and indexes |
| **Authentication** | Server-Side Sessions | Bcrypt (12 rounds) + SHA-256 session token hashing |
| **Validation** | Zod | Request body, query parameter, and form input validation |
| **Testing** | Vitest + Testing Library | 18 unit tests covering validation, security, and hardware calculations |
| **Hosting** | Vercel Hobby | Zero paid external backend dependencies required |

---

## 🚀 Quickstart & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/nodedrops/nodedrops.xyz.git
cd nodedrops-xyz
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
Configure your TiDB Cloud Starter connection string in `.env`. If `DATABASE_URL` is omitted, the application will automatically run in high-fidelity demonstration fallback mode with zero crashes.

### 3. Generate Prisma Client & Migrate
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

### 4. Create Initial Administrator
```bash
npm run admin:create
```

### 5. Launch Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the public website or `/login` to access the Admin Panel.

---

## 🧪 Automated Testing & Verification

Run the test suite:
```bash
npm run test
```

Strict TypeScript check:
```bash
npx tsc --noEmit
```

Production build:
```bash
npm run build
```

---

## 📚 Documentation Links
- [DEPLOYMENT.md](DEPLOYMENT.md) — Vercel Hobby + TiDB Cloud setup & custom domain configuration
- [DATABASE.md](DATABASE.md) — TiDB schema, connection pool settings, and quota recovery
- [SECURITY.md](SECURITY.md) — Threat model, admin recovery CLI, and secret rotation
- [TESTING.md](TESTING.md) — Automated testing architecture and test execution
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution workflow and engineering standards

---

## ⚖️ Legal & Disclaimer
NodeDrops.xyz is an educational platform. Running blockchain validator nodes involves technical and financial risks. NodeDrops never requires wallet connections to read guides and does not promise airdrops, token distributions, or financial profits.
