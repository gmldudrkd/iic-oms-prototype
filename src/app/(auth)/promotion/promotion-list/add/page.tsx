"use client";

import PromotionForm from "@/features/promotion-detail/components/PromotionForm";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";

export default function PromotionAddPage() {
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
              { href: "", label: "Add Promotion" },
            ]}
          />
        </div>
      </div>
      <div className="bg-white">
        <PromotionForm mode="add" />
      </div>
    </>
  );
}
