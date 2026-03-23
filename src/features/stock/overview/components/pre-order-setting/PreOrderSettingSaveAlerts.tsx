import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType =
  | "expiredAtNotSet"
  | "preOrderQuantityNotSet"
  | "confirmTransfer"
  | null;

interface PreOrderSettingSaveAlertsProps {
  activeAlert: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
}

const ALERT_CONFIGS: Record<
  Exclude<AlertType, null>,
  {
    content: string;
    confirmLabel: string;
    closeLabel?: string;
    contentColor?: string;
    confirmButtonColor?: "primary" | "error";
    closeButtonColor?: "primary" | "error";
  }
> = {
  expiredAtNotSet: {
    content: "The Expired At must be set to a future date",
    confirmLabel: "OK",
    confirmButtonColor: "primary",
  },
  preOrderQuantityNotSet: {
    content: "The Pre-order Quantity must be set to a positive number",
    confirmLabel: "OK",
    confirmButtonColor: "primary",
  },
  confirmTransfer: {
    content:
      "Content: The entered stock will be sent to the channel immediately. Are you sure you want to continue?",
    confirmLabel: "Continue",
    closeLabel: "Leave without saving",
    contentColor: "black",
    confirmButtonColor: "primary",
    closeButtonColor: "error",
  },
};

function PreOrderSettingSaveAlerts({
  activeAlert,
  onClose,
  onConfirm,
}: PreOrderSettingSaveAlertsProps) {
  if (!activeAlert) return null;

  const config = ALERT_CONFIGS[activeAlert];

  return (
    <AlertDialog
      isButton={false}
      open={true}
      setOpen={() => onClose()}
      maxWidth="xs"
      dialogContent={config.content}
      dialogConfirmLabel={config.confirmLabel}
      dialogCloseLabel={config.closeLabel}
      dialogContentProps={{
        sx: {
          color: config.contentColor,
        },
      }}
      postButtonProps={{
        color: config.confirmButtonColor,
      }}
      closeButtonProps={
        config.closeButtonColor
          ? {
              color: config.closeButtonColor,
            }
          : undefined
      }
      handlePost={() => {
        if (activeAlert === "confirmTransfer" && onConfirm) {
          onConfirm();
        } else {
          onClose();
        }
      }}
    />
  );
}

export default memo(PreOrderSettingSaveAlerts);
