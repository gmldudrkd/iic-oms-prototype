import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType = "noItemsSelected" | "singleOnly" | null;

interface ChangeChannelSendStatusAlertsProps {
  activeAlert: AlertType;
  onClose: () => void;
}

const ALERT_CONFIGS: Record<
  Exclude<AlertType, null>,
  {
    content: string;
    confirmLabel: string;
  }
> = {
  noItemsSelected: {
    content: "Please select a product.",
    confirmLabel: "OK",
  },
  singleOnly: {
    content: "Please select only items with “Product Type” set to “Single”.",
    confirmLabel: "OK",
  },
};

function ChangeChannelSendStatusAlerts({
  activeAlert,
  onClose,
}: ChangeChannelSendStatusAlertsProps) {
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
      dialogContentProps={{
        sx: {
          color: "black",
        },
      }}
      postButtonProps={{
        color: "primary",
      }}
      handlePost={onClose}
    />
  );
}

export default memo(ChangeChannelSendStatusAlerts);
