import InfoExchange from "@/features/integrated-order-detail/components/InfoExchange";
import InfoLogHistory from "@/features/integrated-order-detail/components/InfoLogHistory";
import InfoOrder from "@/features/integrated-order-detail/components/InfoOrder";
import InfoReshipment from "@/features/integrated-order-detail/components/InfoReshipment";
import InfoReturn from "@/features/integrated-order-detail/components/InfoReturn";
import Tab from "@/features/integrated-order-detail/components/Tab";

export default function OrderDetail({
  activeType,
  setActiveType,
}: {
  activeType: "order" | "return" | "exchange" | "reshipment" | "log-history";
  setActiveType: (
    activeType: "order" | "return" | "exchange" | "reshipment" | "log-history",
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-[24px]">
      {/* InfoTab */}
      <Tab activeType={activeType} setActiveType={setActiveType} />
      {activeType === "order" && <InfoOrder />}
      {activeType === "return" && <InfoReturn />}
      {activeType === "exchange" && <InfoExchange />}
      {activeType === "reshipment" && <InfoReshipment />}
      {activeType === "log-history" && <InfoLogHistory />}
    </div>
  );
}
