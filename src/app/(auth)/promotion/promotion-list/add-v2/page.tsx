"use client";

import PromotionFormV2 from "@/features/promotion-detail/components/PromotionFormV2";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";

export default function PromotionAddV2Page() {
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
              { href: "", label: "Add Promotion V2" },
            ]}
          />
        </div>
      </div>
      <PromotionFormV2 />
    </>
  );
}
