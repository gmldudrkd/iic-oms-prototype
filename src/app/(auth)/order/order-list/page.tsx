"use client";

import IntegratedOrderList from "@/features/integrated-order-list";

import Title from "@/shared/components/text/Title";

export default function OrderListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Order List" variant="default" />
        </div>
      </div>
      <IntegratedOrderList group="order" />
    </>
  );
}
