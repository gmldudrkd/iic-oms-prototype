"use client";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";

/**
 * 기프트카드 시리얼번호를 클릭 가능한 링크 형태로 노출하는 컴포넌트.
 * 클릭 시 시리얼번호를 클립보드에 복사하고 스낵바로 피드백을 보여준다.
 */
export default function GiftCardSerialLink({
  serial,
  className = "",
}: {
  serial: string;
  className?: string;
}) {
  const openSnackbar = useSnackbarStore((state) => state.openSnackbar);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(serial);
      openSnackbar({
        message: `Gift card serial copied: ${serial}`,
        severity: "success",
      });
    } catch {
      openSnackbar({
        message: "Failed to copy gift card serial",
        severity: "error",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer text-primary underline decoration-dotted underline-offset-2 hover:opacity-80 ${className}`}
    >
      {serial}
    </button>
  );
}
