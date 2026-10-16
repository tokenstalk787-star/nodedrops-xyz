import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, hashToken, generateSessionToken } from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";

describe("Security & Authentication Engine", () => {
  it("should securely hash and verify passwords with bcrypt", async () => {
    const raw = "NodeDropsSecPassword2026!";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const valid = await verifyPassword(raw, hash);
    expect(valid).toBe(true);

    const wrong = await verifyPassword("WrongPassword", hash);
    expect(wrong).toBe(false);
  });

  it("should generate cryptographically random 64-char hex session tokens", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it("should create deterministic SHA-256 token hashes for database indexing", () => {
    const token = "a".repeat(64);
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("should enforce sliding window rate limiting and block excess requests", () => {
    const testId = `test_rate_limit_${Date.now()}`;
    const limit = 3;

    // 1st request
    const r1 = checkRateLimit(testId, limit, 10000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    // 2nd request
    const r2 = checkRateLimit(testId, limit, 10000);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    // 3rd request
    const r3 = checkRateLimit(testId, limit, 10000);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request -> blocked
    const r4 = checkRateLimit(testId, limit, 10000);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
