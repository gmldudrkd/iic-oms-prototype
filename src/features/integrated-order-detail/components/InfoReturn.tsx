import { useParams } from "next/navigation";
import { useEffect } from "react";

import ReturnDetailInfo from "@/features/integrated-order-detail/components/ReturnDetailInfo";
import { useGetOrderDetail } from "@/features/integrated-order-detail/hooks/useGetOrderDetail";
import { useGetReturnDetail } from "@/features/integrated-order-detail/hooks/useGetReturnDetail";

import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export default function InfoReturn() {
  const { orderId } = useParams();
  const { openSnackbar } = useSnackbarStore();
  const { setOrderInfo } = useOrderNoStore((state) => state);
  const {
    data,
    isLoading,
    error: returnDetailError,
  } = useGetReturnDetail(orderId as string);
  const { data: orderData } = useGetOrderDetail(orderId as string);

  useEffect(() => {
    if (orderData && orderData.originOrderNo) {
      setOrderInfo({
        orderNo: orderData.originOrderNo,
        isGifted: orderData.orderType.name === "GIFT",
      });
    }
  }, [orderData, setOrderInfo]);

  // 반품 상세 조회 에러시 토스트 팝업
  useEffect(() => {
    if (returnDetailError) {
      openSnackbar({
        message: returnDetailError.errorMessage,
        severity: "error",
      });
    }
  }, [returnDetailError, openSnackbar]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-[calc(100vh-294px)] w-full items-center justify-center text-text-disabled">
        No return registered
      </div>
    );
  }

  if (data) {
    return data.map((item) => {
      return <ReturnDetailInfo key={item.returnId} returnData={item} />;
    });
  }

  if (isLoading || !data) return null;
}
