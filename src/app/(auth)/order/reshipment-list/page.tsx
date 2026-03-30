"use client";

import List from "@/features/integrated-order-list";

import Title from "@/shared/components/text/Title";

export default function ReshipmentListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Reshipment List" variant="default" />
        </div>
      </div>
      <List group="reshipment" />
    </>
  );
}
