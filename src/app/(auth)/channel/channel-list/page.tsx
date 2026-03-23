"use client";

import ChannelList from "@/features/channel-list";

import Title from "@/shared/components/text/Title";

export default function ChannelListPage() {
  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="Channel List" variant="default" />
        </div>
      </div>
      <ChannelList />
    </>
  );
}
