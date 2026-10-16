import { describe, it, expect } from "vitest";
import { evaluateHardware } from "@/lib/services/data-service";

describe("Hardware Compatibility Evaluator", () => {
  it("should return MEETS_RECOMMENDED when specs exceed recommended values", async () => {
    const res = await evaluateHardware({
      networkSlug: "ethereum-sepolia",
      nodeType: "Full Node",
      cpuCores: 16,
      ramGb: 64,
      ssdGb: 2000,
      bandwidthMbps: 500,
      operatingSystem: "Ubuntu 24.04 LTS",
    });

    expect(res.status).toBe("MEETS_RECOMMENDED");
    expect(res.details.every((d) => d.meetsRecommended)).toBe(true);
  });

  it("should return MEETS_MINIMUM when specs meet min but not recommended", async () => {
    const res = await evaluateHardware({
      networkSlug: "ethereum-sepolia",
      nodeType: "Full Node",
      cpuCores: 4, // min is 4, rec is 8
      ramGb: 16, // min is 16, rec is 32
      ssdGb: 500, // min is 500, rec is 1000
      bandwidthMbps: 50,
      operatingSystem: "Ubuntu 24.04 LTS",
    });

    expect(res.status).toBe("MEETS_MINIMUM");
    expect(res.details.some((d) => !d.meetsRecommended)).toBe(true);
    expect(res.details.every((d) => d.meetsMin)).toBe(true);
  });

  it("should return BELOW_MINIMUM when RAM or CPU is insufficient", async () => {
    const res = await evaluateHardware({
      networkSlug: "ethereum-sepolia",
      nodeType: "Full Node",
      cpuCores: 2, // min is 4 -> below
      ramGb: 8, // min is 16 -> below
      ssdGb: 500,
      bandwidthMbps: 50,
      operatingSystem: "Ubuntu 24.04 LTS",
    });

    expect(res.status).toBe("BELOW_MINIMUM");
    expect(res.details.some((d) => !d.meetsMin)).toBe(true);
  });

  it("should return INSUFFICIENT_INFORMATION when network is unknown", async () => {
    const res = await evaluateHardware({
      networkSlug: "non-existent-network",
      nodeType: "Full Node",
      cpuCores: 8,
      ramGb: 16,
      ssdGb: 500,
      bandwidthMbps: 50,
      operatingSystem: "Ubuntu 24.04 LTS",
    });

    expect(res.status).toBe("INSUFFICIENT_INFORMATION");
  });
});
