"use client";

import ProductDetail from "@/features/product-detail";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";
import HeaderChip from "@/shared/components/HeaderChip";
import Title from "@/shared/components/text/Title";

export default function ProductDetailPage({
  params,
}: {
  params: { sku: string };
}) {
  const { sku } = params;
  const isBundle = sku.startsWith("B");

  return (
    <>
      <div className="flex flex-col border-b border-outlined">
        <div className="bg-white px-[24px] py-[24px]">
          <BreadcrumbsComponent
            items={[
              {
                href: "/product/product-list",
                label: "Product List",
              },
              { href: "", label: "Product detail" },
            ]}
          />
          <Title
            text={`SKU Code: ${sku}`}
            variant="default"
            classNames="flex-row items-center gap-2"
          >
            <HeaderChip type={isBundle ? "bundle" : "single"} />
          </Title>
        </div>
      </div>
      <ProductDetail />
    </>
  );
}
