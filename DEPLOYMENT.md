# NodeDrops.xyz — Vercel & TiDB Cloud Production Deployment Guide

This guide covers deploying NodeDrops.xyz to Vercel Hobby tier connected to a TiDB Cloud Starter database with custom domain `nodedrops.xyz`.

---

## 1. Prerequisites

- A GitHub repository containing the NodeDrops codebase.
- A free Vercel account ([vercel.com](https://vercel.com)).
- A free TiDB Cloud account ([tidbcloud.com](https://tidbcloud.com)).
- DNS access for `nodedrops.xyz`.

---

## 2. Step 1: Provision TiDB Cloud Starter Cluster

1. Sign in to **TiDB Cloud** and click **Create Cluster**.
2. Select **Starter (Free)** tier.
3. Choose your nearest cloud region (e.g. AWS us-west-2 or GCP us-central1).
4. Click **Create**.
5. Once active, click **Connect** -> **Connect with Prisma**.
6. Note down the connection string with TLS enabled:
   ```text
   mysql://<user>.<random>:<password>@<host>:4000/nodedrops?sslaccept=strict
   ```

---

## 3. Step 2: Configure Environment Variables

In your Vercel Project Settings -> **Environment Variables**, configure:

| Variable | Recommended Value | Scope | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `mysql://...@...:4000/nodedrops?sslaccept=strict` | Production, Preview | TiDB connection string |
| `NODE_ENV` | `production` | Production | Enforces strict cookies & secure headers |
| `SESSION_SECRET` | *(64-char random hex string)* | Production, Preview | Cryptographic session salt |
| `NEXT_PUBLIC_APP_URL` | `https://nodedrops.xyz` | Production | Canonical site URL |

> [!CAUTION]
> Never prefix database credentials or session secrets with `NEXT_PUBLIC_`.

---

## 4. Step 3: Run Database Migrations

From your local machine or CI pipeline:
```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Deploy schema migrations to TiDB
npm run prisma:migrate

# 3. Seed baseline categories and networks safely
npm run db:seed

# 4. Provision your initial administrator
npm run admin:create
```

---

## 5. Step 4: Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. In Vercel, import the GitHub repository.
3. Select framework preset **Next.js**.
4. Set root directory to `./`.
5. Click **Deploy**.

---

## 6. Step 5: Configure Custom Domain (nodedrops.xyz)

1. In Vercel, go to **Settings** -> **Domains**.
2. Add `nodedrops.xyz` and `www.nodedrops.xyz`.
3. In your DNS registrar (e.g. Cloudflare, Namecheap, GoDaddy):
   - Add an `A` record pointing `@` to `76.76.21.21` (Vercel IP).
   - Add a `CNAME` record pointing `www` to `cname.vercel-dns.com`.
4. Wait for automatic SSL certificate generation.

---

## 7. Step 6: Post-Deployment Smoke Test Checklist

- [ ] Visit `https://nodedrops.xyz` — verify dark Web3 dashboard renders.
- [ ] Visit `/api/health` — confirm status is `"ok"` and database reports `"connected"`.
- [ ] Test the **Hardware Checker** (`/tools/hardware-checker`) with custom sliders.
- [ ] Test the **Command Builder** (`/tools/command-builder`) and copy a template.
- [ ] Test the **Setup Checklist** (`/tools/checklist`) — toggle tasks and verify progress persists across page reloads.
- [ ] Visit `/login` and authenticate using the credentials created via `npm run admin:create`.
- [ ] Verify access to `/admin` dashboard and inspect telemetry charts.
- [ ] Inspect `/sitemap.xml` and `/robots.txt` to confirm no private/admin routes are exposed.
