"use client";

import List from "@/features/integrated-order-list";

import Title from "@/shared/components/text/Title";

export default function ReturnListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Return List" variant="default" />
        </div>
      </div>
      <List group="return" />
    </>
  );
}
