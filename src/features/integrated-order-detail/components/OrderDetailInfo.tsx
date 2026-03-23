import { Chip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import CancelOrder from "@/features/integrated-order-detail/components/CancelOrder";
import OrderInfoWrapper from "@/features/integrated-order-detail/components/OrderInfoWrapper";
import RegisterClaim from "@/features/integrated-order-detail/components/RegisterClaim";
import RequestShipment from "@/features/integrated-order-detail/components/RequestShipment";
import { transformOrderDetailData } from "@/features/integrated-order-detail/models/transforms";
import { transformRowsRequestShipment } from "@/features/integrated-order-detail/models/transforms";
import { getRecipientPhone } from "@/features/integrated-order-detail/modules/utils";

import {
  DetailGrid,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import { Cell } from "@/shared/components/table/tableStyle";
import {
  OrderDetailResponse,
  OrderSearchRequestOrderStatusesEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { getLocalTime } from "@/shared/utils/formatDate";

const ORDER_STATUS = OrderSearchRequestOrderStatusesEnum;
const { PENDING, COLLECTED, PARTLY_CONFIRMED, PARTIAL_SHIPMENT_REQUESTED } =
  ORDER_STATUS;

export default function OrderDetailInfo() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );
  const rows = useMemo(() => transformRowsRequestShipment(data), [data]);

  const [open, setOpen] = useState<string | null>(null);
  const { timezone } = useTimezoneStore();
  const transformedData = useMemo(
    () => transformOrderDetailData({ data, timezone }),
    [timezone, data],
  );

  const { orderDetail } = transformedData || {};

  const buttonConditions = useMemo(() => {
    const items = data?.items ?? [];
    return {
      //  Partly Confirmed 또는 Partial Shipment Requested 상태에서만 노출
      requestPartialShipment:
        data?.status.name === PARTLY_CONFIRMED ||
        data?.status.name === PARTIAL_SHIPMENT_REQUESTED,

      // ( (OrderedQty.Shipment) + (ClaimQty.Reshipped) ) > ClaimQty.Returned
      registerClaim: items.some(
        (item) =>
          item.shippedQuantity + item.reshippedQuantity > item.returnedQuantity,
      ),

      // Pending, Collected, Partly Confirmed, Partial Shipment Requested 상태
      cancelOrder:
        data?.status.name === PENDING ||
        data?.status.name === COLLECTED ||
        data?.status.name === PARTLY_CONFIRMED ||
        data?.status.name === PARTIAL_SHIPMENT_REQUESTED, // 부분 출고 후 재고 없는 상품 취소 처리를 위함
    };
  }, [data]);

  return (
    <OrderInfoWrapper title="Order Detail">
      <DetailGrid>
        <div>
          <h3>Channel</h3>
          <Cell>{orderDetail.channel}</Cell>
        </div>
        <div>
          <h3>Order Date</h3>
          <Cell>{orderDetail.orderDate}</Cell>
        </div>
      </DetailGrid>

      <DetailGridSingle>
        <div>
          <h3>Order Status</h3>
          <Cell>
            <Chip label={orderDetail.orderStatus} color="primary" />
            <span className="ml-[17px] text-[13px] font-medium text-[rgba(0,0,0,0.38)]">
              {data && getLocalTime(data.updatedAt, timezone)}
            </span>
            <div className="!ml-auto flex gap-[16px]">
              {buttonConditions.requestPartialShipment && (
                <RequestShipment
                  open={open === "REQUEST_PARTIAL_SHIPMENT"}
                  setOpen={setOpen}
                  rows={rows}
                />
              )}
              {buttonConditions.registerClaim && (
                <RegisterClaim
                  open={open === "REGISTER_CLAIM"}
                  setOpen={setOpen}
                />
              )}
              {buttonConditions.cancelOrder && (
                <CancelOrder open={open === "CANCEL_ORDER"} setOpen={setOpen} />
              )}
            </div>
          </Cell>
        </div>
      </DetailGridSingle>

      {orderDetail.purchaseNo && (
        <DetailGridSingle>
          <div>
            <h3>Purchase No</h3>
            <Cell>{orderDetail.purchaseNo}</Cell>
          </div>
        </DetailGridSingle>
      )}
      <DetailGrid>
        <div>
          <h3>Orderer Name</h3>
          <Cell>{orderDetail.ordererName}</Cell>
        </div>
        <div>
          <h3>Orderer Phone</h3>
          <Cell>
            {getRecipientPhone(
              data?.orderer?.phoneCountryNo,
              data?.orderer?.phone ?? "",
            )}
          </Cell>
        </div>
      </DetailGrid>
      <DetailGridSingle>
        <div>
          <h3>Orderer Email</h3>
          <Cell>{orderDetail.ordererEmail}</Cell>
        </div>
      </DetailGridSingle>
    </OrderInfoWrapper>
  );
}
