import { Tabs, Tab } from "@mui/material";
import { useState } from "react";

import ChannelDefaultRate from "@/features/stock/distributionSetting/components/ChannelDefaultRate";
import ProductRate from "@/features/stock/distributionSetting/components/ProductRate";
import { DistributionSettingTabType } from "@/features/stock/distributionSetting/models/types";
import {
  CHANNEL_DEFAULT_RATE,
  PRODUCT_RATE,
} from "@/features/stock/distributionSetting/modules/constants";

export default function StockDistributionSetting() {
  const [currentTab, setCurrentTab] =
    useState<DistributionSettingTabType>(CHANNEL_DEFAULT_RATE);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: DistributionSettingTabType,
  ) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{
          bgcolor: "white",
          padding: "16px 24px 0",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Tab
          value={CHANNEL_DEFAULT_RATE}
          label={CHANNEL_DEFAULT_RATE}
          sx={{ textTransform: "none" }}
        />
        <Tab
          value={PRODUCT_RATE}
          label={PRODUCT_RATE}
          sx={{ textTransform: "none" }}
        />
      </Tabs>

      <div className="mx-[24px] overflow-hidden rounded-[5px] border border-outlined bg-white">
        {currentTab === CHANNEL_DEFAULT_RATE && <ChannelDefaultRate />}
        {currentTab === PRODUCT_RATE && <ProductRate />}
      </div>
    </div>
  );
}
