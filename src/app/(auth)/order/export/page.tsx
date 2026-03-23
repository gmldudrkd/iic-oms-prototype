"use client";

import ExportOrder from "@/features/export-order";

import Title from "@/shared/components/text/Title";

export default function ExportPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Export" variant="default" />
        </div>
      </div>
      <ExportOrder />
    </>
  );
}
