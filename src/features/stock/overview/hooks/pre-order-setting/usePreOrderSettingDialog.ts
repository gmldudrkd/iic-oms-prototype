import { useState, useCallback } from "react";

import { PreOrderSetting } from "@/features/stock/overview/models/types";

export function usePreOrderSettingDialog() {
  const [open, setOpen] = useState(false);
  const [preOrderSetting, setPreOrderSetting] = useState<PreOrderSetting>({
    preOrderExpiredAt: undefined,
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setPreOrderSetting({
      preOrderExpiredAt: undefined,
    });
  }, []);

  const handleOpenWithPreOrderSetting = useCallback(
    (setting: PreOrderSetting) => {
      setPreOrderSetting(setting);
      setOpen(true);
    },
    [],
  );

  return {
    open,
    preOrderSetting,
    setPreOrderSetting,
    handleOpen,
    handleClose,
    handleOpenWithPreOrderSetting,
  };
}
