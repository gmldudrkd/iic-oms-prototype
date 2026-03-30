"use client";

import { useParams } from "next/navigation";

import User from "@/features/user";

import Title from "@/shared/components/text/Title";

export default function UserPage() {
  const { email }: { email: string } = useParams();
  const decodedEmail = decodeURIComponent(email);

  return (
    <>
      <div className="flex flex-col border-b border-outlined bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title
            text={decodedEmail}
            classNames="flex flex-row justify-between items-center w-full"
          >
            <p className="text-[12px]">
              Approval can only be processed within the closed network of the
              head office.
            </p>
          </Title>
        </div>
      </div>
      <User />
    </>
  );
}
