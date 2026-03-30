import ContentDialog from "@/shared/components/dialog/ContentDialog";

export default function ModalBump({
  open,
  setOpen,
  handlePost,
  handleClose,
  text,
  dialogConfirmLabel,
  dialogCloseLabel,
  postButtonClassNames,
  closeButtonClassNames,
  buttonDisable = false,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handlePost: () => void;
  handleClose: () => void;
  text: string;
  dialogConfirmLabel: string;
  dialogCloseLabel: string;
  postButtonClassNames?: string;
  closeButtonClassNames?: string;
  buttonDisable?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <ContentDialog
      open={open}
      setOpen={setOpen}
      maxWidth={children ? "sm" : "xs"}
      dialogTitleClassNames="hidden"
      dialogContent={
        <>
          <p className="mt-[16px] whitespace-pre-line">{text}</p>
          {children}
        </>
      }
      dialogConfirmLabel={dialogConfirmLabel}
      dialogCloseLabel={dialogCloseLabel}
      handlePost={handlePost}
      handleClose={handleClose}
      variant="text"
      postButtonClassNames={`!font-bold !text-[14px] ${postButtonClassNames}`}
      closeButtonClassNames={`!text-[14px] ${closeButtonClassNames}`}
      buttonDisable={buttonDisable}
    />
  );
}
