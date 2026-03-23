"use client";

import ChannelDetail from "@/features/channel-detail";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";
import Title from "@/shared/components/text/Title";

export default function AddChannelPage() {
  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white px-[24px] pt-[24px]">
          <BreadcrumbsComponent
            items={[
              {
                href: "/channel/channel-list",
                label: "Channel List",
              },
            ]}
          />
          <Title text="Add new channel" />
        </div>
      </div>
      <ChannelDetail />
    </>
  );
}
