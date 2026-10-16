import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  hardwareCheckerSchema,
  commandBuilderSchema,
  contactFormSchema,
  guideFeedbackSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should accept valid email and minimum password length", () => {
      const valid = loginSchema.safeParse({
        email: "operator@nodedrops.xyz",
        password: "SuperSecretPassword123",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalid = loginSchema.safeParse({
        email: "not-an-email",
        password: "SuperSecretPassword123",
      });
      expect(invalid.success).toBe(false);
    });

    it("should reject short password", () => {
      const invalid = loginSchema.safeParse({
        email: "operator@nodedrops.xyz",
        password: "short",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("hardwareCheckerSchema", () => {
    it("should validate complete hardware specs within bounds", () => {
      const valid = hardwareCheckerSchema.safeParse({
        networkSlug: "ethereum-sepolia",
        nodeType: "Full Node",
        cpuCores: 8,
        ramGb: 32,
        ssdGb: 1000,
        bandwidthMbps: 100,
        operatingSystem: "Ubuntu 24.04 LTS",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject negative or zero CPU cores", () => {
      const invalid = hardwareCheckerSchema.safeParse({
        networkSlug: "ethereum-sepolia",
        nodeType: "Full Node",
        cpuCores: 0,
        ramGb: 32,
        ssdGb: 1000,
        bandwidthMbps: 100,
        operatingSystem: "Ubuntu 24.04 LTS",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("commandBuilderSchema", () => {
    it("should validate moniker sanitization and allowed characters", () => {
      const valid = commandBuilderSchema.safeParse({
        networkSlug: "ethereum-sepolia",
        client: "Geth",
        operatingSystem: "Ubuntu 24.04",
        installationMethod: "Systemd",
        networkType: "TESTNET",
        customMoniker: "Valid-Node_01",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject monikers with shell injection characters", () => {
      const invalid = commandBuilderSchema.safeParse({
        networkSlug: "ethereum-sepolia",
        client: "Geth",
        operatingSystem: "Ubuntu 24.04",
        installationMethod: "Systemd",
        networkType: "TESTNET",
        customMoniker: "Node; rm -rf /",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("contactFormSchema", () => {
    it("should validate legitimate contact message", () => {
      const valid = contactFormSchema.safeParse({
        name: "DevOps Engineer",
        email: "devops@example.com",
        subject: "Validator Guide Question",
        message: "I encountered a P2P sync question on step 2.",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject message shorter than 10 characters", () => {
      const invalid = contactFormSchema.safeParse({
        name: "DevOps Engineer",
        email: "devops@example.com",
        subject: "Hi",
        message: "Too short",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("guideFeedbackSchema", () => {
    it("should validate feedback payload", () => {
      const valid = guideFeedbackSchema.safeParse({
        guideId: "guide-eth-sepolia",
        helpful: true,
        message: "Worked seamlessly on Hetzner VPS!",
      });
      expect(valid.success).toBe(true);
    });
  });
});
