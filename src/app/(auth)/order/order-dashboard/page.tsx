"use client";

import OrderDashboard from "@/features/dashboard";

import Title from "@/shared/components/text/Title";

export default function OrderDashboardPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Order Overview" variant="default" />
        </div>
      </div>
      <OrderDashboard />
    </>
  );
}
