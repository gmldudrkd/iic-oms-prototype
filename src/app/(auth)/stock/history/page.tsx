import StockHistory from "@/features/stock/history";

import Title from "@/shared/components/text/Title";

export default function StockHistoryPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-white px-[24px] pt-[24px]">
        <Title text="Stock History" classNames="flex-row items-center gap-2" />
      </div>
      <StockHistory />
    </div>
  );
}
