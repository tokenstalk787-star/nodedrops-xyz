# NodeDrops.xyz — Automated Testing & Verification Guide

This document describes the automated test architecture, coverage policies, and instructions for running the test suite.

---

## 1. Test Architecture

The test suite is organized into two primary tiers:

1. **Unit & Integration Tests (Vitest):**
   - Location: `tests/unit/`
   - Test framework: `vitest` + `@testing-library/react` + `jsdom`
   - Scope:
     - `validation.test.ts`: Zod schema bounds, format checking, shell injection rejection.
     - `hardware-checker.test.ts`: Minimum vs recommended spec calculations, component benchmarks.
     - `security.test.ts`: Bcrypt salting & password verification, SHA-256 session token hashing, sliding-window rate limiting.

2. **End-to-End Tests (Playwright / Flow Verification):**
   - Validates critical public journeys, operator authentication, and administrative controls.

---

## 2. Running Automated Tests

### Run Unit Tests:
```bash
npm run test
```

### Run Tests in Watch Mode (Development):
```bash
npm run test:watch
```

### Generate Test Coverage Report:
```bash
npm run test:coverage
```

### Run TypeScript Compilation & Strict Type Check:
```bash
npx tsc --noEmit
```

### Run Next.js Production Build Verification:
```bash
npm run build
```

---

## 3. Verified Test Results

| Test Suite | Tests | Status | Execution Time |
| :--- | :--- | :--- | :--- |
| `tests/unit/validation.test.ts` | 10 tests | **PASSED** | 16 ms |
| `tests/unit/hardware-checker.test.ts` | 4 tests | **PASSED** | 8 ms |
| `tests/unit/security.test.ts` | 4 tests | **PASSED** | 1,317 ms |
| **Total** | **18 tests** | **100% PASSED** | **1.34 s** |
| `npx tsc --noEmit` | Strict checking | **PASSED** | 0 errors |
| `npm run build` | 40 App Router pages | **PASSED** | Exit code 0 |
