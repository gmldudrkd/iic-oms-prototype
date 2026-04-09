import { capitalizeFirstLetter } from "@/shared/utils/stringUtils";

export default function Tab({
  activeType,
  setActiveType,
}: {
  activeType: "order" | "return" | "exchange" | "reshipment" | "log-history";
  setActiveType: (
    type: "order" | "return" | "exchange" | "reshipment" | "log-history",
  ) => void;
}) {
  return (
    <div className="flex flex-row gap-[16px] border-b border-outlined bg-white px-[24px] pt-[16px]">
      <TabButton
        type="order"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <TabButton
        type="return"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <TabButton
        type="exchange"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <TabButton
        type="reshipment"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <TabButton
        type="log-history"
        activeType={activeType}
        setActiveType={setActiveType}
      />
    </div>
  );
}

const TabButton = ({
  type,
  activeType,
  setActiveType,
}: {
  type: "order" | "return" | "exchange" | "reshipment" | "log-history";
  activeType: "order" | "return" | "exchange" | "reshipment" | "log-history";
  setActiveType: (
    type: "order" | "return" | "exchange" | "reshipment" | "log-history",
  ) => void;
}) => {
  const typeName =
    type === "log-history" ? "Log" : capitalizeFirstLetter(`${type} info`);

  return (
    <button
      className={`border-b-[2px] border-solid ${
        activeType === type
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary"
      } px-[16px] py-[9px] text-[15px] font-medium`}
      onClick={() => setActiveType(type)}
    >
      {typeName}
    </button>
  );
};
