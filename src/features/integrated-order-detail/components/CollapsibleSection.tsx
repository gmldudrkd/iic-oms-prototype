import { Box } from "@mui/material";
import { useState } from "react";

import ModalLogHistoryExchange from "@/features/integrated-order-detail/components/ModalLogHistoryExchange";
import ModalLogHistoryOrder from "@/features/integrated-order-detail/components/ModalLogHistoryOrder";
import ModalLogHistoryReturn from "@/features/integrated-order-detail/components/ModalLogHistoryReturn";

import ContentDialog from "@/shared/components/dialog/ContentDialog";

import IconArrowDropDownFilled from "@/assets/icons/IconArrowDropDownFilled";

export default function CollapsibleSection({
  title,
  isExpanded,
  toggleExpanded,
  children,
  rightButtonText,
}: {
  title: "Order" | "Return" | "Exchange";
  isExpanded: boolean;
  toggleExpanded: () => void;
  children: React.ReactNode;
  rightButtonText?: string;
}) {
  // 단일 상태로 모달 열림/닫힘 제어
  const [openModal, setOpenModal] = useState<
    "Order" | "Return" | "Exchange" | null
  >(null);

  // 모달 열림/닫힘 토글 함수
  const handleModalToggle = () => {
    // 이미 해당 모달이 열려 있다면 닫고, 아니라면 현재 title로 열기
    if (openModal === title) {
      setOpenModal(null);
    } else {
      setOpenModal(title);
    }
  };

  return (
    <Box className="relative mx-[24px] rounded-[8px] border border-outlined bg-white">
      <Box>
        <button
          className="flex items-center gap-[8px] p-[16px] text-[20px] font-bold"
          onClick={toggleExpanded}
        >
          <IconArrowDropDownFilled
            className={`w-[40px] ${isExpanded ? "" : "rotate-[270deg]"}`}
            color="#707070"
          />
          <span>{title} log</span>
        </button>

        {rightButtonText && (
          <button
            className="absolute right-[24px] top-[14px] px-[8px] py-[6px] text-[14px] font-medium"
            onClick={handleModalToggle}
          >
            {rightButtonText}
          </button>
        )}

        {/* Order 모달 */}
        <ContentDialog
          open={openModal === "Order"}
          setOpen={() => setOpenModal(null)}
          dialogTitle="Order Status Guide"
          dialogContent={<ModalLogHistoryOrder />}
          dialogConfirmLabel="Close"
          handlePost={() => setOpenModal(null)}
          maxWidth="xl"
        />

        {/* Return 모달 */}
        <ContentDialog
          open={openModal === "Return"}
          setOpen={() => setOpenModal(null)}
          dialogTitle="Return Status Guide"
          dialogContent={<ModalLogHistoryReturn />}
          dialogConfirmLabel="Close"
          handlePost={() => setOpenModal(null)}
          maxWidth="xl"
        />

        {/* Exchange 모달 */}
        <ContentDialog
          open={openModal === "Exchange"}
          setOpen={() => setOpenModal(null)}
          dialogTitle="Exchange Status Guide"
          dialogContent={<ModalLogHistoryExchange />}
          dialogConfirmLabel="Close"
          handlePost={() => setOpenModal(null)}
          maxWidth="xl"
        />
      </Box>

      {isExpanded && children}
    </Box>
  );
}
