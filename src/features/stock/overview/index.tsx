"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

import ChannelStockSetting from "@/features/stock/overview/components/channel-stock/ChannelStockSetting";
import OnlineStockSetting from "@/features/stock/overview/components/online-stock/OnlineStockSetting";
import { StockSettingTabType } from "@/features/stock/overview/models/types";
import {
  ONLINE_STOCK_SETTING_VALUE,
  CHANNEL_STOCK_SETTING_VALUE,
} from "@/features/stock/overview/modules/constants";

export default function StockOverview() {
  const [currentTab, setCurrentTab] = useState<StockSettingTabType>(
    ONLINE_STOCK_SETTING_VALUE,
  );

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: StockSettingTabType,
  ) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{
          bgcolor: "white",
          padding: "16px 24px 0",
        }}
      >
        <Tab
          value={ONLINE_STOCK_SETTING_VALUE}
          label="Online Stock Setting"
          sx={{ textTransform: "none" }} // 자동 대문자 변환 방지
        />
        <Tab
          value={CHANNEL_STOCK_SETTING_VALUE}
          label="Channel Stock Setting"
          sx={{ textTransform: "none" }}
        />
      </Tabs>

      <Box position="relative">
        {/* form 초기화 방지 및 DataGrid 너비 유지를 위해 position 사용 */}
        <Box
          sx={{
            position:
              currentTab === "online-stock-setting" ? "relative" : "absolute",
            visibility:
              currentTab === "online-stock-setting" ? "visible" : "hidden",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: currentTab === "online-stock-setting" ? 1 : 0,
          }}
        >
          <OnlineStockSetting />
        </Box>

        <Box
          sx={{
            position:
              currentTab === "channel-stock-setting" ? "relative" : "absolute",
            visibility:
              currentTab === "channel-stock-setting" ? "visible" : "hidden",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: currentTab === "channel-stock-setting" ? 1 : 0,
          }}
        >
          <ChannelStockSetting />
        </Box>
      </Box>
    </>
  );
}
