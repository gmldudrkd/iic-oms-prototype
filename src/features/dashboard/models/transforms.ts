import {
  DashboardState,
  DashboardSection,
  DashboardItem,
} from "@/features/dashboard/models/types";

import {
  DashboardSummaryResponse,
  StatusCount,
} from "@/shared/generated/oms/types/OrderDashboard";

export const transformDashboardData = (
  data: DashboardSummaryResponse,
): DashboardState => {
  const {
    orderSummaries,
    returnSummaries,
    exchangeSummaries,
    shipmentSummaries,
  } = data;

  const toItems = (counts?: StatusCount[]): DashboardItem[] =>
    (counts || []).map((c) => ({ label: c.status.name, count: c.count }));

  const transformSection = (
    counts?: StatusCount[],
    totalCount?: number,
  ): DashboardSection => ({
    items: toItems(counts),
    ...(totalCount !== undefined && totalCount >= 0 && { totalCount }),
  });

  return {
    order: {
      awaiting: transformSection(
        orderSummaries?.awaitingCounts,
        orderSummaries?.awaitingTotalCount,
      ),
      inProgress: transformSection(
        orderSummaries?.inProgressCounts,
        orderSummaries?.inProgressTotalCount,
      ),
      shipping: transformSection(
        shipmentSummaries?.inProgressCounts,
        (shipmentSummaries?.inProgressTotalCount || 0) +
          (shipmentSummaries?.finalizedTotalCount || 0),
      ),
      shippingClosed: transformSection(shipmentSummaries?.finalizedCounts),
      finalized: transformSection(
        orderSummaries?.finalizedCounts,
        orderSummaries?.finalizedTotalCount,
      ),
    },
    return: {
      awaiting: transformSection(
        returnSummaries?.awaitingCounts,
        returnSummaries?.awaitingTotalCount,
      ),
      inProgress: transformSection(
        returnSummaries?.inProgressCounts,
        returnSummaries?.inProgressTotalCount,
      ),
      finalized: transformSection(
        returnSummaries?.finalizedCounts,
        returnSummaries?.finalizedTotalCount,
      ),
    },
    exchange: {
      awaiting: transformSection(
        exchangeSummaries?.awaitingCounts,
        exchangeSummaries?.awaitingTotalCount,
      ),
      inProgress: transformSection(
        exchangeSummaries?.inProgressCounts,
        exchangeSummaries?.inProgressTotalCount,
      ),
      finalized: transformSection(
        exchangeSummaries?.finalizedCounts,
        exchangeSummaries?.finalizedTotalCount,
      ),
    },
  };
};
