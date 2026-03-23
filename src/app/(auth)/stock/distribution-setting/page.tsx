"use client";

import StockDistributionSetting from "@/features/stock/distributionSetting";

import Title from "@/shared/components/text/Title";

export default function StockDistributionSettingPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-white px-[24px] pt-[24px]">
        <Title
          text="Stock Distribution Setting"
          classNames="flex-row items-center gap-2"
        />
      </div>
      <StockDistributionSetting />
    </div>
  );
}
