"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

import OrderDetail from "@/features/integrated-order-detail";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";
import HeaderChip from "@/shared/components/HeaderChip";
import Title from "@/shared/components/text/Title";
import { OrderDetailResponse } from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import { useOrderNoStore } from "@/shared/stores/useOrderNoStore";

export default function ExchangeListDetailPage() {
  const { orderInfo } = useOrderNoStore((state) => state);
  const [activeType, setActiveType] = useState<
    "order" | "return" | "exchange" | "reshipment" | "log-history"
  >("exchange");

  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white px-[24px] pt-[24px]">
          <BreadcrumbsComponent
            items={[
              {
                href: "/order/exchange-list",
                label: "Exchange List",
              },
              { href: "", label: "Exchange detail" },
            ]}
          />
          {/* store로 데이터 가져오기 */}
          <Title
            text={`Order #${orderInfo.orderNo}`}
            classNames="flex-row items-center gap-2"
          >
            {data?.orderType.name === "GIFT" && <HeaderChip type="gift" />}
          </Title>
        </div>
      </div>

      <OrderDetail activeType={activeType} setActiveType={setActiveType} />
    </>
  );
}
