import { Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import DetailForm from "@/features/channel-detail/components/DetailForm";
import { useGetChannelDetail } from "@/features/channel-detail/hooks/useGetChannelDetail";
import { usePatchChannelDetail } from "@/features/channel-detail/hooks/usePatchChannelDetail";
import { usePostChannelDetail } from "@/features/channel-detail/hooks/usePostChannelDetail";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import {
  ChannelCreateRequest,
  ChannelUpdateRequest,
} from "@/shared/generated/oms/types/Channel";
import { useFormValidation } from "@/shared/hooks/useFormValidation";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

interface Props {
  isEdit?: boolean;
}
export default function ChannelDetail({ isEdit = false }: Props) {
  const [open, setOpen] = useState<"BACK_TO_LIST" | "SAVE" | null>(null);
  const [
    openPostChannelDetailErrorDialog,
    setOpenPostChannelDetailErrorDialog,
  ] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const onSuccess = () => {
    router.push("/channel/channel-list");
  };

  const { data: channelDetail } = useGetChannelDetail(id as string);
  const { mutate: postChannelDetail } = usePostChannelDetail({
    onSuccess,
    onError: (error: ApiError) => {
      // 이미 등록된 채널 코드 추가시 에러 얼럿을 기획서와 통일하기 위해 추가
      if (error?.errorMessage?.includes("already registered")) {
        return setOpenPostChannelDetailErrorDialog(true);
      }

      openSnackbar({
        message: error.errorMessage,
        severity: "error",
        alertTitle: "Save failed",
      });
    },
  });
  const { mutate: patchChannelDetail } = usePatchChannelDetail({ onSuccess });

  const defaultValues = {
    channelName: "",
    sapChannelCode: "",
    category: "",
    sapChannelName: "",
    isActive: false,
    brand: "",
  };
  const methods = useForm({ mode: "onChange", defaultValues });

  useEffect(() => {
    if (channelDetail) {
      methods.reset({
        channelName: channelDetail.channelName,
        sapChannelCode: channelDetail.sapChannelCode,
        category: channelDetail.channelType,
        sapChannelName: channelDetail.sapChannelName,
        isActive: channelDetail.isActive,
        brand: channelDetail.brand.name,
      });
    }
  }, [channelDetail, methods]);

  const handleSubmit = methods.handleSubmit((data: FieldValues) => {
    const { brand, sapChannelCode, category, isActive, channelName } = data;

    if (isEdit) {
      // edit 요청
      const requestData: ChannelUpdateRequest = {
        category,
        channelName,
        isActive,
      };
      patchChannelDetail({ id, data: requestData });
    } else {
      // add 요청
      const requestData: ChannelCreateRequest = {
        brand,
        category,
        channelCode: sapChannelCode,
        isActive,
      };

      // console.log("requestData", requestData);
      postChannelDetail(requestData);
    }
  });

  // 뒤로가기
  const handlePost = useCallback(() => router.back(), [router]);

  // 뒤로가기 다이얼로그 열기
  const handleClickOpen = useCallback(() => {
    if (methods.formState.isDirty) {
      setOpen("BACK_TO_LIST");
    } else {
      router.back();
    }
  }, [methods.formState.isDirty, router]);

  // 버튼 비활성화 여부
  const fieldRequired = ["sapChannelCode", "category"];
  const isFormValid = useFormValidation(methods, fieldRequired);
  const isButtonDisabled = useMemo(() => {
    if (isEdit) {
      return !methods.formState.isDirty;
    } else {
      return !isFormValid;
    }
  }, [isEdit, methods, isFormValid]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-row justify-end gap-[16px] border-b border-outlined bg-white px-[24px] pb-[24px]">
            {/* Back to list 버튼 클릭 다이얼로그 */}
            <AlertDialog
              maxWidth="xs"
              buttonLabel="Cancel"
              closeButtonClassNames="border-none"
              postButtonClassNames="text-error border-none"
              dialogContent="You have unsaved changes. Are you sure you want to leave this page without saving?"
              dialogCloseLabel="Stay on this page"
              dialogConfirmLabel="Leave without saving"
              open={open === "BACK_TO_LIST"}
              setOpen={(open) => setOpen(open ? "BACK_TO_LIST" : null)}
              preventClose={false}
              handlePost={handlePost}
              handleClickOpen={handleClickOpen}
            />

            <AlertDialog
              maxWidth="xs"
              dialogContent={`SAP Channel Code ${methods.watch("sapChannelCode")} is already registered in OMS. Please try a different code.`}
              dialogConfirmLabel="OK"
              postButtonClassNames="!text-primary !font-bold"
              isButton={false}
              open={openPostChannelDetailErrorDialog}
              setOpen={(open) => setOpenPostChannelDetailErrorDialog(open)}
              handlePost={() => setOpenPostChannelDetailErrorDialog(false)}
            />

            <Button
              variant="contained"
              color="primary"
              className="w-fit self-end"
              disabled={isButtonDisabled}
              type="submit"
            >
              Save
            </Button>
          </div>

          <DetailForm isEdit={isEdit} />
        </div>
      </form>
    </FormProvider>
  );
}
