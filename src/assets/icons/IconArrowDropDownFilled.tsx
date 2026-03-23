export default function IconArrowDropDownFilled({
  className,
  color = "white",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M7 9.5L12 14.5L17 9.5H7Z" fill={color} />
    </svg>
  );
}
