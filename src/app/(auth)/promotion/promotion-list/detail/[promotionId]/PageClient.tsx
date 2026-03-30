"use client";

import { useParams } from "next/navigation";

import PromotionDetail from "@/features/promotion-detail";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";

export default function PromotionDetailPage() {
  const { promotionId } = useParams<{ promotionId: string }>();

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
              { href: "", label: "Promotion detail" },
            ]}
          />
        </div>
      </div>
      <div className="bg-white">
        <PromotionDetail promotionId={promotionId} />
      </div>
    </>
  );
}
