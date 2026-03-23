"use client";

import UserList from "@/features/user-list";

import Title from "@/shared/components/text/Title";

export default function UserListPage() {
  return (
    <>
      <div className="flex flex-col border-b border-outlined bg-white">
        <div className="px-[24px] pt-[24px]">
          <Title text="User List" />
          <p className="pb-[16px] text-[12px] text-black/60">
            Only users associated with the brand/corp where you hold Admin level
            will be displayed.
            <br />
            i.e., Only users who either have permission or request to the
            brand/corp will be shown.
          </p>
        </div>
      </div>
      <UserList />
    </>
  );
}
