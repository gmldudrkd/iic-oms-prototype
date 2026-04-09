import { useParams } from "next/navigation";
import { useEffect } from "react";

import ReshipmentDetailInfo from "@/features/integrated-order-detail/components/ReshipmentDetailInfo";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";
import { useGetReshipmentDetail } from "@/features/integrated-order-detail/hooks/useGetReshipmentDetail";

import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";

export default function InfoReshipment() {
  const { orderId } = useParams();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data, isLoading } = useGetReshipmentDetail(orderId as string);
  const { data: orderData } = useGetOrderDetail(orderId as string);

  useEffect(() => {
    if (orderData && orderData.originOrderNo) {
      setOrderInfo({
        orderNo: orderData.originOrderNo,
        isGifted: orderData.orderType.name === "GIFT",
      });
    }
  }, [orderData, setOrderInfo]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-[calc(100vh-294px)] w-full items-center justify-center text-text-disabled">
        No reshipment registered
      </div>
    );
  }

  if (data) {
    return data.map((item) => (
      <ReshipmentDetailInfo
        key={item.reshipmentId}
        reshipmentData={item}
        orderId={orderId as string}
        corporation={orderData?.corporation}
        brand={orderData?.brand?.name}
      />
    ));
  }

  if (isLoading || !data) return null;
}
