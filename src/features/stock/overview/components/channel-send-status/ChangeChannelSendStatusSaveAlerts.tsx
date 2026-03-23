import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType =
  | "endDateBeforeStartDate"
  | "startDateBeforeCurrentTime"
  | "noPeriodSelected"
  | null;

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
  endDateBeforeStartDate: {
    content:
      "The end date and time must be set to a future date and time after the start date and time.",
    confirmLabel: "OK",
  },
  startDateBeforeCurrentTime: {
    content: "The start date and time must be set to a future date and time.",
    confirmLabel: "OK",
  },
  noPeriodSelected: {
    content: "Period is required.",
    confirmLabel: "OK",
  },
};

function ChangeChannelSendStatusSaveAlerts({
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

export default memo(ChangeChannelSendStatusSaveAlerts);
