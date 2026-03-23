import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType =
  | "transferQtyExceedsUndistributed"
  | "confirmTransfer"
  | null;

interface StockTransferSaveAlertsProps {
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
  transferQtyExceedsUndistributed: {
    content:
      "Cannot move more than the available quantity in the 'From' channel.",
    confirmLabel: "OK",
    contentColor: "red",
    confirmButtonColor: "primary",
  },
  confirmTransfer: {
    content:
      "The data being saved will be immediately transferred to the channel.  Continue?",
    confirmLabel: "Continue",
    closeLabel: "Leave without saving",
    contentColor: "black",
    confirmButtonColor: "primary",
    closeButtonColor: "error",
  },
};

function StockTransferSaveAlerts({
  activeAlert,
  onClose,
  onConfirm,
}: StockTransferSaveAlertsProps) {
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

export default memo(StockTransferSaveAlerts);
