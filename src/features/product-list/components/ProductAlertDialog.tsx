import AlertDialog from "@/shared/components/dialog/AlertDialog";

/**
 * product 오류 알럿 모달
 * @param  openErrorDialog 알럿 모달 열림 여부
 * @param  setOpenErrorDialog 알럿 모달 열림 여부 설정
 * @returns
 */

interface ProductAlertDialogProps {
  openErrorDialog: React.ReactNode | null;
  setOpenErrorDialog: (openErrorDialog: React.ReactNode | null) => void;
}

export default function ProductAlertDialog({
  openErrorDialog,
  setOpenErrorDialog,
}: ProductAlertDialogProps) {
  return (
    <AlertDialog
      open={openErrorDialog !== null}
      setOpen={() => setOpenErrorDialog(null)}
      dialogTitle="Action Failed"
      dialogTitleClassNames="!bg-white !text-default"
      isButton={false}
      maxWidth="xs"
      buttonLabel="OK"
      postButtonClassNames="!font-bold"
      dialogContent={openErrorDialog}
      dialogCloseLabel="OK"
      preventClose={false}
    />
  );
}
