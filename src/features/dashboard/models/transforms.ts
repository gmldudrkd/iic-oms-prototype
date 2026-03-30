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
    reshipmentSummaries,
    storePickupSummaries,
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
      finalized: transformSection(
        orderSummaries?.finalizedCounts,
        orderSummaries?.finalizedTotalCount,
      ),
    },
    shipment: {
      inProgress: transformSection(
        shipmentSummaries?.inProgressCounts,
        shipmentSummaries?.inProgressTotalCount,
      ),
      finalized: transformSection(
        shipmentSummaries?.finalizedCounts,
        shipmentSummaries?.finalizedTotalCount,
      ),
    },
    // TODO: storePickup 데이터 추가
    storePickup: {
      inProgress: transformSection(
        storePickupSummaries?.inProgressCounts,
        storePickupSummaries?.inProgressTotalCount,
      ),
      finalized: transformSection(
        storePickupSummaries?.finalizedCounts,
        storePickupSummaries?.finalizedTotalCount,
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
    reshipment: {
      inProgress: transformSection(
        reshipmentSummaries?.inProgressCounts,
        reshipmentSummaries?.inProgressTotalCount,
      ),
      finalized: transformSection(
        reshipmentSummaries?.finalizedCounts,
        reshipmentSummaries?.finalizedTotalCount,
      ),
    },
  };
};
