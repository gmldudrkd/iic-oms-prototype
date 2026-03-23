import { useParams } from "next/navigation";
import { useEffect } from "react";

import ExchangeDetailInfo from "@/features/integrated-order-detail/components/ExchangeDetailInfo";
import { useGetExchangeDetail } from "@/features/integrated-order-detail/hooks/useGetExchangeDetail";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";

import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";

export default function InfoExchange() {
  const { orderId } = useParams();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const { data, isLoading } = useGetExchangeDetail(orderId as string);
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
        No exchange registered
      </div>
    );
  }

  if (data) {
    return data.map((item) => {
      return <ExchangeDetailInfo key={item.exchangeId} exchangeData={item} />;
    });
  }

  if (isLoading || !data) return null;
}
