"use client";

import Title from "@/shared/components/text/Title";

export default function PromotionPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-[calc(100vh-64px)]">
      <Title text="Promotion" size="large" />
      <p className="text-[14px] text-black/60 mt-[8px]">정책확인 페이지 입니다.</p>
    </div>
  );
}
