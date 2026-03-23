import StockOverview from "@/features/stock/overview";

import Title from "@/shared/components/text/Title";

export default function StockOverviewPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-white px-[24px] pt-[24px]">
        <Title text="Stock Overview" classNames="flex-row items-center gap-2" />
      </div>
      <StockOverview />
    </div>
  );
}
