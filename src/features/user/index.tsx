import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import UserDataGrid from "@/features/user/components/UserDataGrid";
import UserDetailCard from "@/features/user/components/UserDetailCard";
import { useGetUsers } from "@/features/user/hooks/useGetUsers";

import { HTTP_STATUS } from "@/shared/apis/types";
import Title from "@/shared/components/text/Title";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

export default function User() {
  const { email }: { email: string } = useParams();
  const { openSnackbar } = useSnackbarStore();
  const [errorShown, setErrorShown] = useState(false);

  const { data, isError, error } = useGetUsers(email);

  useEffect(() => {
    if (error?.status === HTTP_STATUS.BAD_REQUEST) {
      return;
    }

    if (isError && error && !errorShown) {
      openSnackbar({
        alertTitle: "Data retrieval failed",
        message: (error as ApiError)?.errorMessage || "error",
        severity: "error",
      });
      setErrorShown(true);
    }
  }, [isError, error, errorShown, openSnackbar]);

  return (
    <>
      {/* User Detail Card */}
      {isPrototype && (
        <UserDetailCard
          requestedDate="2025.12.02 00:00:00"
          approvalStatus="AWAITING"
          userStatus="사용자 비활성"
        />
      )}

      {/* Permissions */}
      <div className="mx-[24px] mt-[24px] mb-[24px] flex flex-col rounded-[5px] border border-outlined bg-white">
        <Title
          text="Permissions"
          classNames="px-[24px] py-[16px] font-bold"
        />
        <UserDataGrid data={data} />
      </div>
    </>
  );
}
