import { Chip } from "@mui/material";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import EditRecipientInfo from "@/features/integrated-order-detail/components/EditRecipientInfo";
import RefundGradingContent from "@/features/integrated-order-detail/components/RefundGradingContent";
import usePatchReturnCancel from "@/features/integrated-order-detail/hooks/usePatchReturnCancel";
import usePatchReturnRequestPickup from "@/features/integrated-order-detail/hooks/usePatchReturnRequestPickup";
import {
  transformReturnDetail,
  transformRowsReturnDetail,
} from "@/features/integrated-order-detail/models/transforms";
import {
  LIST_COLUMNS_RETURN_DETAIL,
  LIST_COLUMNS_PRODUCT_INSPECTION_RESULT,
} from "@/features/integrated-order-detail/modules/columns";
import { NOT_STARTED } from "@/features/integrated-order-detail/modules/constants";
import { DATA_GRID_STYLES_PRODUCT_INSPECTION } from "@/features/integrated-order-detail/modules/styles";
import { getRecipientPhone } from "@/features/integrated-order-detail/modules/utils";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import ModalBump from "@/shared/components/modal/ModalBump";
import ModalOrder from "@/shared/components/ModalOrder";
import {
  DetailGrid,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import { Cell } from "@/shared/components/table/tableStyle";
import Title from "@/shared/components/text/Title";
import { ReturnDetailResponse } from "@/shared/generated/oms/types/Return";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { formatAddress, getDisabledText } from "@/shared/utils/stringUtils";

import IconArrowDropDownFilled from "@/assets/icons/IconArrowDropDownFilled";

interface Props {
  returnData: ReturnDetailResponse;
}

export default function ReturnDetailInfo({ returnData }: Props) {
  const { timezone } = useTimezoneStore();
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, string>>({});

  const { mutate: mutateRequestPickup } = usePatchReturnRequestPickup({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.returnDetail(orderId),
      });
      setOpen(null);
    },
  });
  const { mutate: mutateCancelReturn } = usePatchReturnCancel({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.returnDetail(orderId),
      });
      setOpen(null);
    },
  });

  const returnDetail = useMemo(
    () => transformReturnDetail(returnData, timezone),
    [returnData, timezone],
  );
  const rows = useMemo(
    () => transformRowsReturnDetail(returnData),
    [returnData],
  );

  const buttonConditions = useMemo(() => {
    return {
      pickupRequest: returnData.status.name === "PENDING",
      changeToCancel:
        returnData.status.name === "PENDING" ||
        returnData.status.name === "PICKUP_ONGOING",
      refund: returnData.status.name === "RECEIVED",
    };
  }, [returnData]);

  const allGraded = useMemo(() => {
    const totalUnits = returnData.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const gradedUnits = Object.values(grades).filter((g) => g !== "").length;
    return totalUnits > 0 && gradedUnits === totalUnits;
  }, [grades, returnData.items]);

  const handleSelectAllGrade = useCallback(
    (grade: string) => {
      const newGrades: Record<string, string> = {};
      returnData.items.forEach((item) => {
        Array.from({ length: item.quantity }, (_, unitIndex) => {
          newGrades[`${item.productCode}-${unitIndex}`] = grade;
        });
      });
      setGrades(newGrades);
    },
    [returnData.items],
  );

  const handleResetGrades = useCallback(() => {
    setGrades({});
  }, []);

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      {/* title */}
      <button
        className="flex w-full items-center gap-[8px] bg-return p-[16px] text-[14px] font-medium text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <IconArrowDropDownFilled />
        ) : (
          <IconArrowDropDownFilled className="rotate-[270deg]" />
        )}
        <p className="text-[16px] font-bold">#{returnData.returnNo}</p>
      </button>

      {isExpanded && (
        <>
          {/* dataGrid */}
          <div className="p-[24px]">
            <ThemeProvider theme={MUIDataGridTheme}>
              <DataGrid
                columns={LIST_COLUMNS_RETURN_DETAIL as GridColDef[]}
                rows={rows}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableColumnSorting
                hideFooter
                sx={DATA_GRID_STYLES}
                rowSpanning={true}
              />
            </ThemeProvider>
            <div className="mt-[16px]">
              <Title
                text="Product Inspection Result"
                classNames="!text-[14px]"
              />
              <ThemeProvider theme={MUIDataGridTheme}>
                <DataGrid
                  columns={
                    LIST_COLUMNS_PRODUCT_INSPECTION_RESULT as GridColDef[]
                  }
                  rows={returnDetail.productInspectionResult}
                  disableColumnMenu
                  disableRowSelectionOnClick
                  disableColumnFilter
                  disableColumnSelector
                  disableColumnSorting
                  hideFooter
                  sx={DATA_GRID_STYLES_PRODUCT_INSPECTION}
                />
              </ThemeProvider>
            </div>
          </div>

          {/* dataTable */}
          <DetailGrid className="border-t border-solid border-[#E0E0E0]">
            <div>
              <h3>Registered By</h3>
              <Cell>{returnDetail.registeredBy}</Cell>
            </div>
            <div>
              <h3>Party at Fault</h3>
              <Cell>{returnDetail.claimFault}</Cell>
            </div>
          </DetailGrid>
          <DetailGridSingle>
            <div>
              <h3>Return reason</h3>
              <Cell>{returnDetail.returnReason}</Cell>
            </div>
          </DetailGridSingle>
          <DetailGridSingle>
            <div>
              <h3>Status</h3>
              <Cell>
                <Chip label={returnDetail.returnStatus} color="warning" />
                <span className="ml-[17px] text-[13px] font-medium text-[rgba(0,0,0,0.38)]">
                  {returnDetail.returnUpdatedDate}
                </span>

                <div className="ml-auto flex gap-[8px]">
                  {buttonConditions.pickupRequest && (
                    <>
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => setOpen("PICKUP_REQUEST")}
                      >
                        Pickup Request
                      </Button>
                      <ModalBump
                        open={open === "PICKUP_REQUEST"}
                        setOpen={(open) =>
                          setOpen(open ? "PICKUP_REQUEST" : null)
                        }
                        text="Request a pickup for this return? This will start the return process."
                        dialogCloseLabel="Cancel"
                        dialogConfirmLabel="Confirm Pickup"
                        handleClose={() => setOpen(null)}
                        handlePost={() =>
                          mutateRequestPickup(returnData.returnId)
                        }
                        closeButtonClassNames="!text-default"
                      />
                    </>
                  )}

                  {buttonConditions.changeToCancel && (
                    <>
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => setOpen("CHANGE_TO_CANCEL_PARTIAL")}
                      >
                        Cancel Return
                      </Button>
                      <ModalBump
                        open={open === "CHANGE_TO_CANCEL_PARTIAL"}
                        setOpen={(open) =>
                          setOpen(open ? "CHANGE_TO_CANCEL_PARTIAL" : null)
                        }
                        text="If canceled, the return process will stop, and the order will stay as it is. This action does not notify the WMS to cancel the pickup — it only updates the return status in the OMS."
                        dialogCloseLabel="Keep Return"
                        dialogConfirmLabel="Cancel Return"
                        handleClose={() => setOpen(null)}
                        handlePost={() =>
                          mutateCancelReturn(returnData.returnId)
                        }
                        closeButtonClassNames="!text-default"
                        postButtonClassNames="!text-error"
                      />
                    </>
                  )}

                  {buttonConditions.refund && (
                    <>
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => setOpen("REFUND_GRADING")}
                      >
                        Refund
                      </Button>
                      <ModalOrder
                        open={open === "REFUND_GRADING"}
                        setOpen={(isOpen) =>
                          setOpen(isOpen ? "REFUND_GRADING" : null)
                        }
                        dialogTitle="반품 Grading"
                        dialogConfirmLabel="Confirm"
                        handlePost={() => setOpen("REFUND_CONFIRM")}
                        handleClose={() => {
                          setOpen(null);
                          setGrades({});
                        }}
                        buttonDisable={!allGraded}
                        content={
                          <RefundGradingContent
                            items={returnData.items}
                            grades={grades}
                            onGradeChange={(key, value) =>
                              setGrades((prev) => ({ ...prev, [key]: value }))
                            }
                            onSelectAllGrade={handleSelectAllGrade}
                            onReset={handleResetGrades}
                          />
                        }
                      />
                      <ModalBump
                        open={open === "REFUND_CONFIRM"}
                        setOpen={(isOpen) =>
                          setOpen(isOpen ? "REFUND_CONFIRM" : null)
                        }
                        text="반품확정하시겠습니까?"
                        dialogCloseLabel="Cancel"
                        dialogConfirmLabel="Confirm"
                        handleClose={() => setOpen("REFUND_GRADING")}
                        handlePost={() => {
                          setOpen(null);
                          setGrades({});
                        }}
                        closeButtonClassNames="!text-default"
                      />
                    </>
                  )}
                </div>
              </Cell>
            </div>
          </DetailGridSingle>
          <DetailGrid>
            <div>
              <h3>Recipient Name</h3>
              <Cell>{returnDetail.recipientName}</Cell>
            </div>
            <div>
              <h3>Recipient No</h3>
              <Cell>
                {getRecipientPhone(
                  returnDetail.phoneCountryNo,
                  returnDetail.recipientPhone,
                )}
              </Cell>
            </div>
          </DetailGrid>
          <DetailGridSingle>
            <div>
              <h3>Pickup Address</h3>
              <Cell>
                {formatAddress(
                  returnDetail.pickupAddress.postcode,
                  returnDetail.pickupAddress.countryRegion,
                  returnDetail.pickupAddress.stateProvince,
                  returnDetail.pickupAddress.city,
                  returnDetail.pickupAddress.address1,
                  returnDetail.pickupAddress.address2,
                )}

                <div className="ml-auto flex gap-[8px]">
                  <EditRecipientInfo
                    returnData={returnData}
                    returnId={returnData.returnId}
                    disabled={returnData.status.name !== "PENDING"}
                  />
                </div>
              </Cell>
            </div>
          </DetailGridSingle>
          <DetailGrid>
            <div>
              <h3>Carrier</h3>
              <Cell>
                <span
                  className={`${getDisabledText(returnDetail.carrier, NOT_STARTED)}`}
                >
                  {returnDetail.carrier}
                </span>
              </Cell>
            </div>
            <div>
              <h3>Tracking No</h3>
              <Cell>
                <span
                  className={`${getDisabledText(returnDetail.trackingNo, NOT_STARTED)}`}
                >
                  {returnDetail.trackingNo}
                </span>
                <Button
                  color="primary"
                  size="small"
                  className="!ml-auto"
                  disabled={!returnDetail.trackingUrl}
                  onClick={() => {
                    if (returnDetail.trackingUrl) {
                      window.open(returnDetail.trackingUrl, "_blank");
                    }
                  }}
                >
                  Track shipping
                </Button>
              </Cell>
            </div>
          </DetailGrid>
        </>
      )}
    </div>
  );
}
