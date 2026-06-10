import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType = "confirmSend" | null;

interface SendAvailableQtySaveAlertsProps {
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
  confirmSend: {
    content:
      "The selected SKUs' Available Qty will be immediately sent to the channel. Continue?",
    confirmLabel: "Continue",
    closeLabel: "Leave without saving",
    contentColor: "black",
    confirmButtonColor: "primary",
    closeButtonColor: "error",
  },
};

function SendAvailableQtySaveAlerts({
  activeAlert,
  onClose,
  onConfirm,
}: SendAvailableQtySaveAlertsProps) {
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
        if (onConfirm) {
          onConfirm();
        } else {
          onClose();
        }
      }}
    />
  );
}

export default memo(SendAvailableQtySaveAlerts);
