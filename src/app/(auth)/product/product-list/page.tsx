"use client";

import ProductList from "@/features/product-list";

import Title from "@/shared/components/text/Title";

export default function ProductListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Product List" variant="default" />
        </div>
      </div>
      <ProductList />
    </>
  );
}
