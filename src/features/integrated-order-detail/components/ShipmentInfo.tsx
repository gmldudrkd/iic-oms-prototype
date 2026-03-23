import { Button, Chip, ThemeProvider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";

import CancelOrder from "@/features/integrated-order-detail/components/CancelOrder";
import CancelShipment from "@/features/integrated-order-detail/components/CancelShipment";
import OrderInfoWrapper from "@/features/integrated-order-detail/components/OrderInfoWrapper";
import RequestShipment from "@/features/integrated-order-detail/components/RequestShipment";
import { transformRowsShipmentInfo } from "@/features/integrated-order-detail/models/transforms";
import { transformRowsRequestShipment } from "@/features/integrated-order-detail/models/transforms";
import { LIST_COLUMNS_SHIPMENT } from "@/features/integrated-order-detail/modules/columns";
import { getRecipientPhone } from "@/features/integrated-order-detail/modules/utils";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import { Cell, DetailGrid } from "@/shared/components/table/tableStyle";
import { DetailGridSingle } from "@/shared/components/table/tableStyle";
import {
  OrderDetailResponse,
  OrderDetailShipmentResponse,
  OrderSearchRequestShipmentStatusesEnum,
  OrderDetailShipmentResponseEventEnum,
} from "@/shared/generated/oms/types/Order";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { formatAddress, getDisabledText } from "@/shared/utils/stringUtils";

import IconArrowDropDownFilled from "@/assets/icons/IconArrowDropDownFilled";

const SHIPMENT_STATUS = OrderSearchRequestShipmentStatusesEnum;
const { PICKING_REJECTED, PICKING_REQUESTED } = SHIPMENT_STATUS;

export default function ShipmentInfo() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<OrderDetailResponse>(
    queryKeys.orderDetail(orderId),
  );

  return (
    <OrderInfoWrapper title="Shipment Info">
      {data &&
        data.shipments.map((shipment) => (
          <ShipmentInfoItem
            key={shipment.shipmentNo}
            shipment={shipment}
            data={data}
          />
        ))}
    </OrderInfoWrapper>
  );
}

function ShipmentInfoItem({
  shipment,
  data,
}: {
  shipment: OrderDetailShipmentResponse;
  data: OrderDetailResponse | undefined;
}) {
  const { timezone } = useTimezoneStore();

  const item = useMemo(
    () => transformRowsShipmentInfo(shipment, timezone),
    [shipment, timezone],
  );

  const NOT_STARTED = "Not started";
  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const rowsReShip = useMemo(() => transformRowsRequestShipment(data), [data]);

  const buttonConditions = useMemo(() => {
    return {
      reShip:
        item.status.name === PICKING_REJECTED &&
        item.event === OrderDetailShipmentResponseEventEnum.REJECT,
      cancelOrder: item.status.name === PICKING_REJECTED,
      cancelShipment: item.status.name === PICKING_REQUESTED,
    };
  }, [item]);

  return (
    <div>
      <button
        className="flex w-full items-center gap-[8px] bg-primary p-[16px] text-[14px] font-medium text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <IconArrowDropDownFilled />
        ) : (
          <IconArrowDropDownFilled className="rotate-[270deg]" />
        )}
        <p className="text-[16px] font-bold">#{item.shipmentNo}</p>
      </button>

      {isExpanded && (
        <>
          <ThemeProvider theme={MUIDataGridTheme}>
            <div className="p-[24px]">
              <DataGrid
                rows={item.rows}
                columns={LIST_COLUMNS_SHIPMENT as GridColDef[]}
                pagination
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableColumnSorting
                disableColumnResize
                disableDensitySelector
                hideFooter
                rowSpanning
                sx={DATA_GRID_STYLES}
              />
            </div>
          </ThemeProvider>

          <DetailGridSingle>
            <div className="border-t border-solid border-[#E0E0E0]">
              <h3>Shipping Status</h3>
              <Cell>
                <Chip label={item.status.description} color="default" />
                <span className="ml-[17px] text-[13px] text-text-secondary">
                  {item.updatedAt}
                </span>

                <div className="ml-auto flex gap-[8px]">
                  {buttonConditions.reShip && (
                    <RequestShipment
                      open={open === "REQUEST_PARTIAL_SHIPMENT"}
                      setOpen={setOpen}
                      rows={rowsReShip ?? []}
                      buttonLabel="Re-ship"
                    />
                  )}

                  {buttonConditions.cancelOrder && (
                    <CancelOrder
                      open={open === "CANCEL_ORDER"}
                      setOpen={setOpen}
                      shipment={shipment}
                    />
                  )}

                  {buttonConditions.cancelShipment && (
                    <CancelShipment
                      open={open === "CANCEL_SHIPMENT"}
                      setOpen={setOpen}
                      shipment={shipment}
                    />
                  )}
                </div>
              </Cell>
            </div>
          </DetailGridSingle>

          <DetailGridSingle>
            <div>
              <h3>Carrier</h3>
              <Cell>
                <span
                  className={`${getDisabledText(item.carrier, NOT_STARTED)}`}
                >
                  {item.carrier}
                </span>
              </Cell>
            </div>
          </DetailGridSingle>

          <DetailGridSingle>
            {item.trackingNo.map(({ trackingNo, trackingUrl }) => (
              <div key={trackingNo}>
                <h3>Tracking No</h3>
                <Cell>
                  <span
                    className={`${getDisabledText(trackingNo, NOT_STARTED)}`}
                  >
                    {trackingNo}
                  </span>
                  <Button
                    color="primary"
                    size="small"
                    className="!ml-auto"
                    disabled={!trackingUrl}
                    onClick={() => {
                      if (trackingUrl) {
                        window.open(trackingUrl, "_blank");
                      }
                    }}
                  >
                    Track shipping
                  </Button>
                </Cell>
              </div>
            ))}
          </DetailGridSingle>

          <DetailGrid>
            <div>
              <h3>Recipient Name</h3>
              <Cell>{item.recipientName}</Cell>
            </div>
            <div>
              <h3>Recipient No</h3>
              <Cell>
                {getRecipientPhone(item.phoneCountryNo, item.recipientNo)}
              </Cell>
            </div>
          </DetailGrid>

          <DetailGridSingle>
            <div>
              <h3>Delivery Address</h3>
              <Cell>
                {formatAddress(
                  item.deliveryAddress.postcode,
                  item.deliveryAddress.countryRegion,
                  item.deliveryAddress.stateProvince,
                  item.deliveryAddress.city,
                  item.deliveryAddress.address1,
                  item.deliveryAddress.address2,
                )}
              </Cell>
            </div>
          </DetailGridSingle>
        </>
      )}
    </div>
  );
}
