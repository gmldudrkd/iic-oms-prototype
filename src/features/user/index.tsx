import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import UserDataGrid from "@/features/user/components/UserDataGrid";
import { useGetUsers } from "@/features/user/hooks/useGetUsers";

import { HTTP_STATUS } from "@/shared/apis/types";
import Title from "@/shared/components/text/Title";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

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
    <div className="mx-[24px] mt-[24px] flex flex-col rounded-[5px] border border-outlined bg-white">
      <Title text="Permissions" classNames="px-[24px] py-[16px] font-bold" />
      <UserDataGrid data={data} />
    </div>
  );
}
