import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import EditRecipientInfo from "@/features/integrated-order-detail/components/EditRecipientInfo";
import OrderInfoWrapper from "@/features/integrated-order-detail/components/OrderInfoWrapper";
import { transformOrderDetailData } from "@/features/integrated-order-detail/models/transforms";
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
import { formatAddress } from "@/shared/utils/stringUtils";

const { PENDING, COLLECTED, PARTLY_CONFIRMED } =
  OrderSearchRequestOrderStatusesEnum;

export default function RecipientInfo() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );
  const isGiftType = data?.orderType.name === "GIFT";

  const { timezone } = useTimezoneStore();
  const transformedData = useMemo(
    () => transformOrderDetailData({ data, timezone }),
    [data, timezone],
  );
  const { recipientInfo } = transformedData || {};
  const deliveryAddress = formatAddress(
    recipientInfo.deliveryAddress.postcode,
    recipientInfo.deliveryAddress.countryRegion,
    recipientInfo.deliveryAddress.stateProvince,
    recipientInfo.deliveryAddress.city,
    recipientInfo.deliveryAddress.address1,
    recipientInfo.deliveryAddress.address2,
  );

  const buttonConditions = useMemo(() => {
    const status = data?.status.name;

    const isEditableStatus =
      status === PENDING || status === COLLECTED || status === PARTLY_CONFIRMED;

    if (!isEditableStatus) {
      return { isEditRecipientInfo: false };
    }

    if (status === PENDING) {
      // gift 타입이면 address 필요, 일반이면 OK
      return {
        isEditRecipientInfo:
          !isGiftType || (isGiftType && deliveryAddress !== "-"),
      };
    }

    // Collected / PartlyConfirmed은 무조건 OK
    return { isEditRecipientInfo: true };
  }, [data?.status.name, isGiftType, deliveryAddress]);

  return (
    <OrderInfoWrapper title="Recipient Info">
      <DetailGrid>
        <div>
          <h3>Recipient Name</h3>
          <Cell>{recipientInfo.recipientName}</Cell>
        </div>
        <div>
          <h3>Recipient Phone</h3>
          <Cell>
            {getRecipientPhone(
              recipientInfo.phoneCountryNo,
              recipientInfo.recipientPhone ?? "",
            )}
          </Cell>
        </div>
      </DetailGrid>
      <DetailGridSingle>
        <div>
          <h3>Delivery Address</h3>
          <Cell>
            {deliveryAddress}
            {data &&
              buttonConditions.isEditRecipientInfo &&
              data.status.name.toUpperCase() !== "COLLECTED" && (
                <EditRecipientInfo />
              )}
          </Cell>
        </div>
      </DetailGridSingle>
    </OrderInfoWrapper>
  );
}
