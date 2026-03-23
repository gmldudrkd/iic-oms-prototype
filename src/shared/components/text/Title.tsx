import { cn } from "@/shared/utils/cn";

interface TitleProps {
  text: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "background" | "bordered";
  backgroundColor?: string;
  color?: string;
  classNames?: string;
  children?: React.ReactNode;
}

const titleVariants = {
  default: `flex-col items-start py-[8px] text-text-primary flex justify-start font-pretendard  font-style-normal`,
  background:
    "h-[64px] bg-primary px-[3px] items-center shadow-[0px_1px_10px_0px_rgba(0,0,0,0.12),0px_4px_5px_0px_rgba(0,0,0,0.14),0px_2px_4px_-1px_rgba(0,0,0,0.20)]",
  bordered:
    "h-[64px] flex items-center justify-between border-b px-[24px] py-[16px] text-[20px] font-bold leading-[16px]",
};

const Title = ({
  text,
  size = "medium",
  variant = "default",
  classNames,
  children,
}: TitleProps) => {
  const getFontSize = () => {
    switch (size) {
      case "large":
        return "24px";
      case "medium":
        return "20px";
      case "small":
        return "18px";
      default:
        return "24px";
    }
  };

  return (
    <div
      className={cn(titleVariants[variant], classNames)}
      style={{
        fontSize: getFontSize(),
        fontWeight: variant === "bordered" ? 700 : 500,
      }}
    >
      {text}
      {children}
    </div>
  );
};

export default Title;
