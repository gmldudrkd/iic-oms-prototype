"use client";

import { useParams } from "next/navigation";

import ChannelDetail from "@/features/channel-detail";

import BreadcrumbsComponent from "@/shared/components/Breadcrumbs";
import Title from "@/shared/components/text/Title";

export default function ChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
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
          <Title text={`Channel No: ${id}`} />
        </div>
      </div>
      <ChannelDetail isEdit />
    </>
  );
}
