"use client";

import ChannelProductList from "@/features/channel-product-list";

import Title from "@/shared/components/text/Title";

export default function ChannelProductListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Channel Product List" variant="default" />
        </div>
      </div>
      <ChannelProductList />
    </>
  );
}
