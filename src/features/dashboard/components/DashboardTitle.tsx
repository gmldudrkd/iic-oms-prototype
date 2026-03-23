// 대시보드 타이틀 컴포넌트 Order | Return | Exchange
import { cn } from "@/shared/utils/cn";

export function DashboardTitle({
  title,
  color,
  icon,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        `border-b-solid bg-${color}-opacity flex items-center gap-[16px] border-b-[2px] border-solid border-b-${color} p-[16px]`,
      )}
    >
      <div>{icon}</div>
      <h2 className={`text-[16px] font-bold text-${color} capitalize`}>
        {title}
      </h2>
    </div>
  );
}
