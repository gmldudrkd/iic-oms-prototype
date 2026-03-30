import DashboardIcon from "@/features/dashboard/components/DashboardIcon";

import { cn } from "@/shared/utils/cn";
import { camelToTitleCase } from "@/shared/utils/stringUtils";

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
      <DashboardIcon icon={icon} bgColor={color} />
      <h2 className={`text-[16px] font-bold text-${color} capitalize`}>
        {camelToTitleCase(title)}
      </h2>
    </div>
  );
}
