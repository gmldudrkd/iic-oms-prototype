"use client";

import Button, { ButtonProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent, { DialogContentProps } from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useEffect } from "react";

interface AlertDialogProps {
  dialogContent: string | React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogConfirmLabel?: string;
  handlePost?: () => void;
  isButton?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  dialogTitleClassNames?: string;
  buttonClassNames?: string;
  dialogCloseLabel?: string;
  closeButtonClassNames?: string;
  closeButtonProps?: ButtonProps;
  postButtonClassNames?: string;
  postButtonProps?: ButtonProps;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  preventClose?: boolean;
  buttonDisable?: boolean;
  handleClickOpen?: () => void;
  dialogContentProps?: DialogContentProps;
}

export default function AlertDialog({
  dialogContent,
  open,
  setOpen,
  dialogConfirmLabel = "",
  handlePost,
  isButton = true,
  buttonLabel,
  dialogTitle,
  dialogTitleClassNames = "",
  dialogCloseLabel = "",
  buttonClassNames = "",
  postButtonClassNames = "",
  closeButtonClassNames = "",
  closeButtonProps = {},
  postButtonProps = {},
  maxWidth = "sm",
  preventClose = false,
  buttonDisable = false,
  handleClickOpen = () => {},
  dialogContentProps = {},
}: AlertDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    // 배경 클릭 막기
    if (reason === "backdropClick") return;

    handleClose();
  };

  useEffect(() => {
    if (preventClose) {
      setOpen(false);
    }
  }, [preventClose, setOpen]);

  return (
    <React.Fragment>
      {isButton && (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          className={buttonClassNames}
          disabled={buttonDisable}
        >
          {buttonLabel}
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        maxWidth={maxWidth}
        fullWidth
        disableEnforceFocus
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {dialogTitle && (
          <DialogTitle
            id="alert-dialog-title"
            className={`bg-primary text-white ${dialogTitleClassNames}`}
          >
            {dialogTitle}
          </DialogTitle>
        )}
        <DialogContent {...dialogContentProps}>{dialogContent}</DialogContent>
        <DialogActions>
          {dialogCloseLabel && (
            <Button
              onClick={handleClose}
              className={`${closeButtonClassNames}`}
              variant="text"
              color="primary"
              {...closeButtonProps}
            >
              {dialogCloseLabel}
            </Button>
          )}
          {dialogConfirmLabel && (
            <Button
              onClick={() => handlePost && handlePost()}
              className={`${postButtonClassNames}`}
              variant="text"
              color="error"
              {...postButtonProps}
            >
              {dialogConfirmLabel}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
