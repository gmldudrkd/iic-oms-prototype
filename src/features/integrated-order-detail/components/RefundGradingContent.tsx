import { useMemo } from "react";

import CheckIcon from "@mui/icons-material/Check";

import { ReturnDetailOrderItemResponse } from "@/shared/generated/oms/types/Return";

const GRADE_OPTIONS = ["A", "B", "C"] as const;

const GRADE_CONFIG = {
  A: { label: "상태 양호", color: "#4CAF50" },
  B: { label: "경미한 손상", color: "#FF9800" },
  C: { label: "심한 손상", color: "#E91E63" },
} as const;

interface RefundGradingContentProps {
  items: ReturnDetailOrderItemResponse[];
  grades: Record<string, string>;
  onGradeChange: (key: string, value: string) => void;
  onSelectAllGrade: (grade: string) => void;
  onReset: () => void;
}

export default function RefundGradingContent({
  items,
  grades,
  onGradeChange,
  onSelectAllGrade,
  onReset,
}: RefundGradingContentProps) {
  const allUnits = useMemo(() => {
    const units: {
      item: ReturnDetailOrderItemResponse;
      unitIndex: number;
      key: string;
      isFirst: boolean;
    }[] = [];
    items.forEach((item) => {
      Array.from({ length: item.quantity }, (_, unitIndex) => {
        units.push({
          item,
          unitIndex,
          key: `${item.productCode}-${unitIndex}`,
          isFirst: unitIndex === 0,
        });
      });
    });
    return units;
  }, [items]);

  const totalUnits = allUnits.length;
  const gradedCount = Object.values(grades).filter((g) => g !== "").length;

  const gradeCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0 };
    Object.values(grades).forEach((g) => {
      if (g in counts) counts[g as keyof typeof counts]++;
    });
    return counts;
  }, [grades]);

  return (
    <div className="mt-[16px]">
      {/* Subtitle */}
      <p className="mb-[12px] text-[13px] text-[rgba(0,0,0,0.6)]">
        매트릭스에서 각 제품의 등급을 클릭하여 선택하세요
      </p>

      {/* Progress */}
      <div className="mb-[16px] flex items-center gap-[8px]">
        <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#E0E0E0]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${totalUnits > 0 ? (gradedCount / totalUnits) * 100 : 0}%`,
            }}
          />
        </div>
        <span className="text-[13px] font-medium text-[rgba(0,0,0,0.6)]">
          {gradedCount}/{totalUnits}
        </span>
      </div>

      {/* Matrix Table */}
      <div className="overflow-hidden rounded-[8px] border border-[#E0E0E0]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px_80px] border-b border-[#E0E0E0] bg-[#FAFAFA]">
          <div className="px-[16px] py-[12px] text-[13px] font-medium text-[rgba(0,0,0,0.6)]">
            제품 / 수량
          </div>
          {GRADE_OPTIONS.map((grade) => (
            <button
              key={grade}
              className="flex cursor-pointer flex-col items-center justify-center py-[8px] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
              onClick={() => onSelectAllGrade(grade)}
            >
              <span
                className="text-[15px] font-bold"
                style={{ color: GRADE_CONFIG[grade].color }}
              >
                {grade}
              </span>
              <span className="text-[11px] text-[rgba(0,0,0,0.5)]">
                {GRADE_CONFIG[grade].label}
              </span>
            </button>
          ))}
        </div>

        {/* Rows */}
        {allUnits.map(({ item, unitIndex, key, isFirst }) => (
          <div
            key={key}
            className="grid grid-cols-[1fr_80px_80px_80px] border-b border-[#E0E0E0] last:border-b-0"
          >
            {/* Product info cell */}
            <div className="px-[16px] py-[10px]">
              {isFirst ? (
                <div className="flex items-start gap-[10px]">
                  <div className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-[4px] border border-[#E0E0E0] bg-[#F5F5F5]">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        className="h-full w-full rounded-[4px] object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[rgba(0,0,0,0.3)]">
                        {item.productName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-text-primary">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-[rgba(0,0,0,0.5)]">
                      {item.productCode}
                    </p>
                    <p className="mt-[2px] text-[12px] text-[rgba(0,0,0,0.6)]">
                      #{unitIndex + 1}
                      {item.quantity > 1 && (
                        <span className="ml-[4px] text-[11px] text-[rgba(0,0,0,0.4)]">
                          (총 {item.quantity}개)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pl-[46px]">
                  <p className="text-[12px] text-[rgba(0,0,0,0.6)]">
                    #{unitIndex + 1}
                  </p>
                </div>
              )}
            </div>

            {/* Grade buttons */}
            {GRADE_OPTIONS.map((grade) => {
              const isSelected = grades[key] === grade;
              return (
                <button
                  key={grade}
                  className="flex cursor-pointer items-center justify-center py-[10px] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                  onClick={() => onGradeChange(key, isSelected ? "" : grade)}
                >
                  {isSelected ? (
                    <div
                      className="flex h-[32px] w-[32px] items-center justify-center rounded-full"
                      style={{ backgroundColor: GRADE_CONFIG[grade].color }}
                    >
                      <CheckIcon sx={{ color: "white", fontSize: 18 }} />
                    </div>
                  ) : (
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border-[2px] border-[#E0E0E0]">
                      <span className="text-[13px] font-medium text-[rgba(0,0,0,0.3)]">
                        {grade}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom summary */}
      <div className="mt-[12px] flex items-center justify-between px-[4px]">
        <div className="flex items-center gap-[16px]">
          {GRADE_OPTIONS.map((grade) => (
            <div key={grade} className="flex items-center gap-[4px]">
              <div
                className="flex h-[20px] w-[20px] items-center justify-center rounded-full"
                style={{ backgroundColor: GRADE_CONFIG[grade].color }}
              >
                <span className="text-[10px] font-bold text-white">
                  {grade}
                </span>
              </div>
              <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                {gradeCounts[grade]}개
              </span>
            </div>
          ))}
        </div>
        <button
          className="text-[13px] text-[rgba(0,0,0,0.5)] transition-colors hover:text-[rgba(0,0,0,0.8)]"
          onClick={onReset}
        >
          초기화
        </button>
      </div>
    </div>
  );
}
