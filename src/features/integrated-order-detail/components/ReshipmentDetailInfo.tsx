import { Button, Chip } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

import CopyTextButton from "@/features/integrated-order-detail/components/CopyTextButton";
import ExchangeActionButton from "@/features/integrated-order-detail/components/ExchangeDetail/ExchangeActionButton";
import {
  transformReshipmentDetail,
  transformRowsReshipmentDetail,
} from "@/features/integrated-order-detail/models/transforms";
import { NOT_STARTED } from "@/features/integrated-order-detail/modules/constants";
import { getRecipientPhone } from "@/features/integrated-order-detail/modules/utils";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import {
  DetailGrid,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import { Cell } from "@/shared/components/table/tableStyle";
import { ReshipmentDetailResponse } from "@/shared/generated/oms/types/Reshipment";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { formatAddress, getDisabledText } from "@/shared/utils/stringUtils";

import IconArrowDropDownFilled from "@/assets/icons/IconArrowDropDownFilled";

const PICKING_REQUESTED = "PICKING_REQUESTED";

const LIST_COLUMNS_RESHIPMENT_DETAIL: GridColDef[] = [
  { field: "no", headerName: "No.", width: 50 },
  { field: "skuCode", headerName: "SKU Code", flex: 1, minWidth: 120 },
  { field: "sapCode", headerName: "SAP Code", flex: 1, minWidth: 120 },
  { field: "sapName", headerName: "SAP Name", flex: 2, minWidth: 200 },
  { field: "qty", headerName: "Qty", width: 80 },
];

interface Props {
  reshipmentData: ReshipmentDetailResponse;
}

export default function ReshipmentDetailInfo({ reshipmentData }: Props) {
  const { timezone } = useTimezoneStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const detail = useMemo(
    () => transformReshipmentDetail(reshipmentData, timezone),
    [reshipmentData, timezone],
  );
  const rows = useMemo(
    () => transformRowsReshipmentDetail(reshipmentData),
    [reshipmentData],
  );

  const buttonConditions = useMemo(() => {
    return {
      cancelShipment: reshipmentData.status.name === PICKING_REQUESTED,
    };
  }, [reshipmentData]);

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      {/* Header */}
      <button
        className="flex w-full items-center gap-[8px] bg-[#E91E63] p-[16px] py-[14px] text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <IconArrowDropDownFilled />
        ) : (
          <IconArrowDropDownFilled className="rotate-[270deg]" />
        )}
        <span className="text-[16px] font-bold">#{detail.reshipmentNo}</span>
        <CopyTextButton text={detail.reshipmentNo} className="!text-white" />
      </button>

      {isExpanded && (
        <>
          {/* DataGrid */}
          <div className="p-[24px]">
            <ThemeProvider theme={MUIDataGridTheme}>
              <DataGrid
                columns={LIST_COLUMNS_RESHIPMENT_DETAIL}
                rows={rows}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableColumnSorting
                disableColumnResize
                disableDensitySelector
                hideFooter
                sx={DATA_GRID_STYLES}
              />
            </ThemeProvider>
          </div>

          {/* Shipping Status */}
          <DetailGridSingle>
            <div className="border-t border-solid border-[#E0E0E0]">
              <h3>Shipping Status</h3>
              <Cell>
                <Chip
                  label={reshipmentData.status.description}
                  color="shipment"
                />
                <span className="ml-[17px] text-[13px] text-text-secondary">
                  {detail.updatedAt}
                </span>

                <div className="ml-auto flex gap-[8px]">
                  {buttonConditions.cancelShipment && (
                    <ExchangeActionButton
                      modalKey="CANCEL_SHIPMENT"
                      open={open}
                      setOpen={setOpen}
                      text="Are you sure you want to cancel this shipment? This action requires WMS confirmation."
                      dialogCloseLabel="Keep Shipment"
                      dialogConfirmLabel="Cancel Shipment"
                      onConfirm={() => {
                        setOpen(null);
                      }}
                      buttonLabel="Cancel Shipment"
                      postButtonClassNames="!text-error"
                    />
                  )}
                </div>
              </Cell>
            </div>
          </DetailGridSingle>

          {/* Carrier */}
          <DetailGridSingle>
            <div>
              <h3>Carrier</h3>
              <Cell>
                <span
                  className={`${getDisabledText(detail.carrier, NOT_STARTED)}`}
                >
                  {detail.carrier}
                </span>
              </Cell>
            </div>
          </DetailGridSingle>

          {/* Tracking No */}
          <DetailGridSingle>
            {detail.trackingNo.map(
              (delivery: { trackingNo: string; trackingUrl?: string }) => (
                <div key={delivery.trackingNo}>
                  <h3>Tracking No</h3>
                  <Cell>
                    <span
                      className={`${getDisabledText(delivery.trackingNo, NOT_STARTED)}`}
                    >
                      {delivery.trackingNo}
                    </span>
                    <Button
                      color="primary"
                      size="small"
                      className="!ml-auto"
                      disabled={!delivery.trackingUrl}
                      onClick={() => {
                        if (delivery.trackingUrl) {
                          window.open(delivery.trackingUrl, "_blank");
                        }
                      }}
                    >
                      Track shipping
                    </Button>
                  </Cell>
                </div>
              ),
            )}
          </DetailGridSingle>

          {/* Recipient */}
          <DetailGrid>
            <div>
              <h3>Recipient Name</h3>
              <Cell>{detail.recipientName}</Cell>
            </div>
            <div>
              <h3>Recipient No</h3>
              <Cell>
                {getRecipientPhone(
                  detail.phoneCountryNo,
                  detail.recipientPhone,
                )}
              </Cell>
            </div>
          </DetailGrid>

          {/* Delivery Address */}
          <DetailGridSingle>
            <div>
              <h3>Delivery Address</h3>
              <Cell>
                {formatAddress(
                  detail.deliveryAddress.postcode,
                  detail.deliveryAddress.countryRegion,
                  detail.deliveryAddress.stateProvince,
                  detail.deliveryAddress.city,
                  detail.deliveryAddress.address1,
                  detail.deliveryAddress.address2,
                )}
              </Cell>
            </div>
          </DetailGridSingle>
        </>
      )}
    </div>
  );
}
