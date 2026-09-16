"use client";

import { Button } from "@mui/material";
import { useCallback, useState } from "react";

import PromotionTemplate from "@/features/promotion-template";

import Title from "@/shared/components/text/Title";

export default function PromotionTemplatePage() {
  // 상단 버튼 → 템플릿 신규 드로어 열기 (증가 카운터로 신호 전달)
  const [openNewSignal, setOpenNewSignal] = useState(0);

  const handleNewTemplate = useCallback(() => {
    setOpenNewSignal((n) => n + 1);
  }, []);

  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between px-[24px] pt-[24px]">
          <Title text="Promotion Template" variant="default" />
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewTemplate}
          >
            + New Template
          </Button>
        </div>
      </div>
      <PromotionTemplate openNewSignal={openNewSignal} />
    </>
  );
}
