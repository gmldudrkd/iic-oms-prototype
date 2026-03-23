import { memo } from "react";

import AlertDialog from "@/shared/components/dialog/AlertDialog";

export type SafetyStockAlertType = "singleOnly" | "noItemsSelected" | null;

interface ChangeSafetyStockAlertsProps {
  activeAlert: SafetyStockAlertType;
  onClose: () => void;
}

const ALERT_CONFIGS: Record<
  Exclude<SafetyStockAlertType, null>,
  {
    content: string;
    confirmLabel: string;
  }
> = {
  singleOnly: {
    content: "Please select only items with “Product Type” set to “Single”.",
    confirmLabel: "OK",
  },
  noItemsSelected: {
    content: "Please select a product.",
    confirmLabel: "OK",
  },
};

function ChangeSafetyStockAlerts({
  activeAlert,
  onClose,
}: ChangeSafetyStockAlertsProps) {
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

export default memo(ChangeSafetyStockAlerts);
