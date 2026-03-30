"use client";

import { useParams } from "next/navigation";

import User from "@/features/user";

import Title from "@/shared/components/text/Title";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

export default function UserPage() {
  const { email }: { email: string } = useParams();
  const decodedEmail = decodeURIComponent(email);

  return (
    <>
      <div className="flex flex-col border-b border-outlined bg-white">
        <div className="px-[24px] pt-[24px]">
          <div className="mb-[4px] text-[12px] text-black/50">
            <a href="/user/user-list" className="hover:underline">
              User list
            </a>
            <span className="mx-[6px]">/</span>
            <span>User detail</span>
          </div>
          <Title
            text={decodedEmail}
            classNames="flex flex-row justify-between items-center w-full"
          >
            {!isPrototype && (
              <p className="text-[12px]">
                Approval can only be processed within the closed network of the
                head office.
              </p>
            )}
          </Title>
        </div>
      </div>
      <User />
    </>
  );
}
