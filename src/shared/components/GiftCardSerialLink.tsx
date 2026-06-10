"use client";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";

/**
 * 기프트카드 시리얼번호를 클릭 가능한 링크 형태로 노출하는 컴포넌트.
 * 클릭 시 GM 관리 페이지 딥링크 URL을 스낵바로 안내한다.
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
    const domain = process.env.NEXT_PUBLIC_HOST_URL ?? "";
    const url = `${domain}/page/gm_manage/?status_flag=&search_id=${serial}&search_idx=`;
    // 클립보드 복사는 부가 기능(실패해도 무시), 안내 문구로 딥링크 URL 노출
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore clipboard errors
    }
    openSnackbar({
      message: url,
      severity: "info",
    });
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
