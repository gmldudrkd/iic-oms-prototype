"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import PromotionList from "@/features/promotion-list";

import Title from "@/shared/components/text/Title";

export default function PromotionListPage() {
  const router = useRouter();

  const handleAddPromotion = useCallback(() => {
    router.push("/promotion/promotion-list/add");
  }, [router]);

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
