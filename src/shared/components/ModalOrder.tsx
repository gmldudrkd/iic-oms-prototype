import ContentDialog from "@/shared/components/dialog/ContentDialog";

export default function ModalOrder({
  open,
  setOpen,
  content,
  dialogTitle,
  dialogConfirmLabel,
  handlePost,
  buttonDisable,
  handleClose = () => {},
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
  dialogTitle: string;
  dialogConfirmLabel: string;
  handlePost?: () => void;
  buttonDisable: boolean;
  handleClose?: () => void;
}) {
  const handleModalClose = () => {
    handleClose?.();
    setOpen(false);
  };

  return (
    <ContentDialog
      dialogTitle={dialogTitle}
      dialogContent={content}
      dialogConfirmLabel={dialogConfirmLabel}
      open={open}
      setOpen={setOpen}
      handlePost={handlePost}
      dialogCloseLabel="Cancel"
      dialogTitleClassNames="bg-primary text-white"
      buttonDisable={buttonDisable}
      maxWidth="md"
      handleClose={handleModalClose}
    />
  );
}
