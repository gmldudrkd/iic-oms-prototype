import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType =
  | "noItemsSelected"
  | "multiChannelSelected"
  | "channelSendStatusOff"
  | "singleOnly"
  | null;

interface PreOrderSettingAlertsProps {
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
  multiChannelSelected: {
    content: "Please select items under only one channel.",
    confirmLabel: "OK",
  },
  channelSendStatusOff: {
    content: "Please select only items with 'Channel Send Status' set to ON.",
    confirmLabel: "OK",
  },
  singleOnly: {
    content: "Please select only items with “Product Type” set to “Single”.",
    confirmLabel: "OK",
  },
};

function PreOrderSettingAlerts({
  activeAlert,
  onClose,
}: PreOrderSettingAlertsProps) {
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

export default memo(PreOrderSettingAlerts);
