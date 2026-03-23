"use client";

import { Button } from "@mui/material";
import { useCallback } from "react";

import PromotionList from "@/features/promotion-list";

import Title from "@/shared/components/text/Title";

export default function PromotionListPage() {
  const handleAddPromotion = useCallback(() => {
    // TODO: 프로모션 추가 페이지로 이동
  }, []);

  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between px-[24px] pt-[24px]">
          <Title text="Promotion List" variant="default" />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPromotion}
          >
            + Add Promotion
          </Button>
        </div>
      </div>
      <PromotionList />
    </>
  );
}
