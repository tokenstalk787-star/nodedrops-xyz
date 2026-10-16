"use client";

import * as React from "react";
import { NodeDashboardHeader } from "./node-dashboard-header";
import { NodeOpportunitiesTable } from "./node-opportunities-table";
import type { OpportunityItem } from "@/lib/services/mock-data";

interface NodeDashboardContainerProps {
  initialOpportunities: OpportunityItem[];
  totalRunbooks?: number;
}

export function NodeDashboardContainer({
  initialOpportunities,
  totalRunbooks = 28,
}: NodeDashboardContainerProps) {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [watchlistCount, setWatchlistCount] = React.useState(0);

  const activeCount = React.useMemo(() => {
    return initialOpportunities.filter((o) => o.campaignStatus === "ACTIVE").length;
  }, [initialOpportunities]);

  const confirmedCount = React.useMemo(() => {
    return initialOpportunities.filter((o) => o.rewardStatus === "CONFIRMED").length;
  }, [initialOpportunities]);

  return (
    <div className="space-y-6">
      {/* PART 1: Dashboard Header, Metrics & Recent Milestone */}
      <NodeDashboardHeader
        totalOpportunities={initialOpportunities.length}
        activeCount={activeCount}
        confirmedCount={confirmedCount}
        totalRunbooks={totalRunbooks}
        activeTab={activeTab}
        onFilterChange={setActiveTab}
        watchlistCount={watchlistCount}
      />

      {/* PART 2: Interactive Filterable Node & Airdrop Opportunities Table */}
      <NodeOpportunitiesTable
        initialOpportunities={initialOpportunities}
        currentTab={activeTab}
        onWatchlistCountChange={setWatchlistCount}
      />
    </div>
  );
}
