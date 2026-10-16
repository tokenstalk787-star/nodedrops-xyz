# NodeDrops.xyz — TiDB Cloud Database & Storage Architecture

## 1. TiDB Cloud Starter Compatibility

NodeDrops.xyz uses TiDB Cloud Starter as its primary relational database via Prisma ORM.

### Connection Requirements:
- **Protocol:** MySQL 8.0 / 5.7 wire-compatible interface.
- **TLS/SSL:** Mandatory. Ensure `?sslaccept=strict` is appended to the connection string.
- **Port:** Standard TiDB Cloud port `4000`.
- **Runtime:** Node.js Serverless runtime (never Edge Runtime for direct Prisma queries).

### Prisma Configuration (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 2. TiDB Cloud Free Tier Allowances & Quotas

TiDB Cloud Starter provides a generous monthly allowance:
- **Row Storage:** 5 GiB
- **Columnar Storage (TiFlash):** 5 GiB
- **Request Units (RU):** 50 Million RUs / month

### Cost-Control & Quota Preservation Rules:
1. **Connection Singleton:** A persistent PrismaClient instance is maintained in `lib/db/prisma.ts` with global caching in development and serverless invocations to avoid exhausting database connections.
2. **Field Projections:** Queries only select necessary columns, avoiding unbounded payload transfers.
3. **Pagination Enforced:** All network, guide, opportunity, and audit log endpoints enforce maximum pagination limits (`limit: 50`).
4. **Static Revalidation:** Public pages (Homepage, Guides, Networks) use Incremental Static Regeneration (`revalidate = 3600`), serving cached HTML from the Vercel Edge network to minimize TiDB Request Units.

---

## 3. Database Unavailable & Quota Exhaustion Fallback

If TiDB Cloud Starter experiences temporary quota exhaustion or connection disruption:
1. The application **does not crash or throw unhandled 500 exceptions**.
2. `lib/services/data-service.ts` detects database unavailability through `isDatabaseConnected()` and safely falls back to the embedded, verified technical seed dataset.
3. `/api/health` reports status `fallback_mode` without leaking connection secrets.
4. When database quota resets or connectivity restores, the service automatically switches back to live database queries on the next invocation.

---

## 4. Migration & Seeding Procedures

### Run Migrations Against TiDB:
```bash
npx prisma migrate deploy
```
*(Never use `prisma db push` in production).*

### Seed Verified Demonstration Data:
```bash
npm run db:seed
```
The seeding script verifies existing records before inserting to guarantee it **never overwrites** existing production data.

### Provision Initial Administrator:
```bash
npm run admin:create
```
Prompts for email, display name, and password, securely hashes via bcrypt, and records an audit log.
