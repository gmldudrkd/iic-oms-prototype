import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import ModalExchange from "@/features/integrated-order-detail/components/LogDetail/ModalExchange";
import ModalOrder from "@/features/integrated-order-detail/components/LogDetail/ModalOrder";
import ModalReturn from "@/features/integrated-order-detail/components/LogDetail/ModalReturn";

type GuideTab = "order" | "return" | "exchange";

/**
 * Status Guide 모달 내부 컨텐츠.
 * Order / Return / Exchange 를 탭으로 구분해 각 상태 가이드를 노출한다.
 */
export default function StatusGuideTabs() {
  const [tab, setTab] = useState<GuideTab>("order");

  return (
    <div>
      <Tabs
        value={tab}
        onChange={(_, value: GuideTab) => setTab(value)}
        sx={{ minHeight: 42, borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label="Order" value="order" className="!min-h-[42px]" />
        <Tab label="Return" value="return" className="!min-h-[42px]" />
        <Tab label="Exchange" value="exchange" className="!min-h-[42px]" />
      </Tabs>
      <Box>
        {tab === "order" && <ModalOrder />}
        {tab === "return" && <ModalReturn />}
        {tab === "exchange" && <ModalExchange />}
      </Box>
    </div>
  );
}
