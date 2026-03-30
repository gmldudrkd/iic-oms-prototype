"use client";

import { useParams } from "next/navigation";

import PromotionForm from "@/features/promotion-detail/components/PromotionForm";
import { getMockPromotionDetail } from "@/features/promotion-detail/modules/mockData";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";

export default function PromotionEditPage() {
  const { promotionId } = useParams<{ promotionId: string }>();
  const detail = getMockPromotionDetail(promotionId);

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white px-[24px] pt-[24px] pb-[8px]">
          <BreadcrumbsComponent
            items={[
              {
                href: "/promotion/promotion-list",
                label: "Promotion list",
              },
              {
                href: `/promotion/promotion-list/detail/${promotionId}`,
                label: "Promotion detail",
              },
              { href: "", label: "Edit Promotion" },
            ]}
          />
        </div>
      </div>
      <div className="bg-white">
        <PromotionForm mode="edit" initialData={detail} />
      </div>
    </>
  );
}
