# Contributing to NodeDrops.xyz

Thank you for helping build reproducible, secure blockchain node documentation and tooling.

---

## 1. Development Workflow

1. Clone or fork the repository:
   ```bash
   git clone https://github.com/nodedrops/nodedrops.xyz.git
   cd nodedrops-xyz
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment placeholders:
   ```bash
   cp .env.example .env
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 2. Code Quality Standards

Before opening a pull request, ensure all verification checks pass:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Automated tests
npm run test

# 3. Production build
npm run build
```

### Guidelines:
- **No `any` Types:** Use strict TypeScript types.
- **No Unvetted External Scripts:** Never suggest piping uninspected remote scripts into bash.
- **Accessible UI:** Maintain WCAG 2.2 AA contrast standards and keyboard navigation for all interactive controls.
- **Safe Database Operations:** Use parameterized queries via Prisma; never concatenate raw strings into SQL.
