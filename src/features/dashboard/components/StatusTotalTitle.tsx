// 대시보드 상태 타이틀 컴포넌트
export function StatusTotalTitle({
  label,
  color,
  count,
}: {
  label: string;
  color: string;
  count: number | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-[16px]">
      <div className="flex items-center gap-[8px]">
        <p
          className={`h-[24px] rounded-[4px] px-[4px] py-[2px] text-[12px] font-[600] text-${color} bg-${color}-opacity`}
        >
          {label}
        </p>
        {(label === "Finalized" || label === "Shipping Closed") && (
          <p className="text-[14px] text-text-disabled">last 30 days</p>
        )}
      </div>
      {(count || count === 0) && (
        <p className={`text-[20px] font-bold text-${color}`}>{count}</p>
      )}
    </div>
  );
}
