import Button from "@mui/material/Button";

import ModalBump from "@/shared/components/modal/ModalBump";

// Exchange 액션 버튼 (확인 모달 포함)
interface ExchangeActionButtonProps {
  modalKey: string;
  open: string | null;
  setOpen: (value: string | null) => void;
  text: string;
  dialogCloseLabel: string;
  dialogConfirmLabel: string;
  onConfirm: () => void;
  buttonLabel: string;
  closeButtonClassNames?: string;
  postButtonClassNames?: string;
}

export default function ExchangeActionButton({
  modalKey,
  open,
  setOpen,
  text,
  dialogCloseLabel,
  dialogConfirmLabel,
  onConfirm,
  buttonLabel,
  closeButtonClassNames,
  postButtonClassNames,
}: ExchangeActionButtonProps) {
  return (
    <>
      <ModalBump
        open={open === modalKey}
        setOpen={(isOpen) => setOpen(isOpen ? modalKey : null)}
        text={text}
        dialogCloseLabel={dialogCloseLabel}
        dialogConfirmLabel={dialogConfirmLabel}
        handleClose={() => setOpen(null)}
        handlePost={onConfirm}
        closeButtonClassNames={closeButtonClassNames}
        postButtonClassNames={postButtonClassNames}
      />
      <Button size="small" onClick={() => setOpen(modalKey)}>
        {buttonLabel}
      </Button>
    </>
  );
}
