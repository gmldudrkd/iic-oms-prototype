import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import {
  transformOrderDetailData,
  transformReturnDetail,
} from "@/features/integrated-order-detail/models/transforms";

import { OrderDetailResponse } from "@/shared/generated/oms/types/Order";
import { ReturnDetailResponse } from "@/shared/generated/oms/types/Return";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

export default function useRecipientDefaultAddress(
  returnData?: ReturnDetailResponse,
) {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { timezone } = useTimezoneStore();

  // Return 케이스: returnData가 제공된 경우
  if (returnData) {
    const recipientInfo = transformReturnDetail(returnData, timezone);

    return {
      recipientFirstName: recipientInfo.recipientFirstName,
      recipientLastName: recipientInfo.recipientLastName,
      phoneCountryNo: recipientInfo.phoneCountryNo ?? "",
      recipientPhone: recipientInfo.recipientPhone ?? "",
      address1: recipientInfo.pickupAddress.address1,
      address2: recipientInfo.pickupAddress.address2,
      city: recipientInfo.pickupAddress.city,
      stateProvince: recipientInfo.pickupAddress.stateProvince,
      postcode: recipientInfo.pickupAddress.postcode,
      countryRegion: recipientInfo.pickupAddress.countryRegion,
    };
  }

  // Order 케이스: returnData가 없는 경우
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );
  const { recipientInfo } = transformOrderDetailData({ data, timezone });

  return {
    recipientFirstName: recipientInfo.recipientFirstName,
    recipientLastName: recipientInfo.recipientLastName,
    phoneCountryNo: recipientInfo.phoneCountryNo ?? "",
    recipientPhone: recipientInfo.recipientPhone ?? "",
    address1: recipientInfo.deliveryAddress.address1,
    address2: recipientInfo.deliveryAddress.address2,
    city: recipientInfo.deliveryAddress.city,
    stateProvince: recipientInfo.deliveryAddress.stateProvince,
    postcode: recipientInfo.deliveryAddress.postcode,
    countryRegion: recipientInfo.deliveryAddress.countryRegion,
  };
}
