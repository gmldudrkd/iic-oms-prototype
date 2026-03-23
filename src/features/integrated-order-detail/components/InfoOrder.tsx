import { useParams } from "next/navigation";
import { useEffect } from "react";

import OrderDetailInfo from "@/features/integrated-order-detail/components/OrderDetailInfo";
import OrderedProductInfo from "@/features/integrated-order-detail/components/OrderedProductInfo";
import PaymentInfo from "@/features/integrated-order-detail/components/PaymentInfo";
import RecipientInfo from "@/features/integrated-order-detail/components/RecipientInfo";
import ShipmentInfo from "@/features/integrated-order-detail/components/ShipmentInfo";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";

import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";

export default function InfoOrder() {
  const { orderId } = useParams();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data, isLoading } = useGetOrderDetail(orderId as string);

  useEffect(() => {
    if (data) {
      setOrderInfo({
        orderNo: data.originOrderNo,
        isGifted: data.orderType.name === "GIFT",
      });
    }
  }, [data, setOrderInfo]);

  if (data)
    return (
      <div className="flex flex-col gap-[24px]">
        <OrderDetailInfo />
        <RecipientInfo />
        <OrderedProductInfo />
        <PaymentInfo />
        {data.shipments.length > 0 && <ShipmentInfo />}
      </div>
    );

  if (isLoading || !data) return null;
}
