"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface ContentDialogProps {
  dialogContent: string | React.ReactNode;
  dialogConfirmLabel?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handlePost?: (value: string | number | null | undefined | unknown) => void;
  dialogTitle?: string;
  dialogTitleClassNames?: string;
  dialogCloseLabel?: string;
  closeButtonClassNames?: string;
  postButtonClassNames?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  preventClose?: boolean;
  buttonDisable?: boolean;
  handleClose?: () => void;
  variant?: "contained" | "text" | "outlined";
}

export default function ContentDialog({
  dialogContent,
  open,
  setOpen,
  dialogConfirmLabel = "",
  handlePost = () => {},
  dialogTitle,
  dialogTitleClassNames = "",
  dialogCloseLabel = "",
  postButtonClassNames = "",
  closeButtonClassNames = "",
  maxWidth = "sm",
  preventClose = false,
  buttonDisable = false,
  variant = "contained",
  handleClose,
}: ContentDialogProps) {
  const handleDialogClose = (
    _: object,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (preventClose) return;
    if (reason === "backdropClick") return;

    handleClose?.();
    setOpen(false);
  };

  return (
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

      <DialogContent id="alert-dialog-description">
        {dialogContent}

        {(dialogCloseLabel || dialogConfirmLabel) && (
          <DialogActions sx={{ "&": { padding: "16px 0px 0px 0px" } }}>
            {dialogCloseLabel && (
              <Button
                onClick={() => {
                  handleClose?.();
                  setOpen(false);
                }}
                className={`${closeButtonClassNames}`}
                variant={variant === "contained" ? "outlined" : variant}
                sx={{
                  "&:hover": {
                    backgroundColor: variant === "text" ? "transparent" : "",
                  },
                }}
              >
                {dialogCloseLabel}
              </Button>
            )}

            {dialogConfirmLabel && (
              <Button
                onClick={() => handlePost(null)}
                className={`${postButtonClassNames}`}
                disabled={buttonDisable}
                variant={variant}
                sx={{
                  "&:hover": {
                    backgroundColor: variant === "text" ? "transparent" : "",
                  },
                }}
              >
                {dialogConfirmLabel}
              </Button>
            )}
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
}
