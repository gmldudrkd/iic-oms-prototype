import { cloneElement, isValidElement } from "react";

interface DashboardIconProps {
  icon: React.ReactNode;
  bgColor: string;
}

export default function DashboardIcon({ icon, bgColor }: DashboardIconProps) {
  // 아이콘이 ReactElement인 경우 className에 text-white 추가
  const iconWithWhiteText = isValidElement(icon)
    ? cloneElement(icon, {
        className: `text-white ${icon.props.className || ""}`,
      } as React.HTMLAttributes<HTMLElement>)
    : icon;

  return (
    <div
      className="flex h-[40px] w-[40px] items-center justify-center gap-[10px] rounded-[10px]"
      style={{
        backgroundColor: `var(--color-${bgColor})`,
      }}
    >
      {iconWithWhiteText}
    </div>
  );
}
