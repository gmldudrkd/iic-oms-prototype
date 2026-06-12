import { memo } from "react";

import { MAX_SEND_SKU_COUNT } from "@/features/stock/overview/hooks/send-available-qty/useSendAvailableQtyValidation";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type AlertType =
  | "noItemsSelected"
  | "singleOnly"
  | "multiChannelSelected"
  | "channelSendStatusOff"
  | "maxSkuExceeded"
  | null;

interface SendAvailableQtyAlertsProps {
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
    content: "Only products with Product Type ‘Single’ can be selected.",
    confirmLabel: "OK",
  },
  multiChannelSelected: {
    content: "This option is only available when one channel is selected.",
    confirmLabel: "OK",
  },
  channelSendStatusOff: {
    content: "This option is only available when ‘Channel send’ status is ‘ON’",
    confirmLabel: "OK",
  },
  maxSkuExceeded: {
    content: `You can select up to ${MAX_SEND_SKU_COUNT} SKUs at a time.`,
    confirmLabel: "OK",
  },
};

function SendAvailableQtyAlerts({
  activeAlert,
  onClose,
}: SendAvailableQtyAlertsProps) {
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

export default memo(SendAvailableQtyAlerts);
