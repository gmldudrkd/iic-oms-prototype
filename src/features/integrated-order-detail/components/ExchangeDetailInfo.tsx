import { Chip } from "@mui/material";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import CopyTextButton from "@/features/integrated-order-detail/components/CopyTextButton";
import ExchangeActionButton from "@/features/integrated-order-detail/components/ExchangeDetail/ExchangeActionButton";
import { MODAL_TEXT } from "@/features/integrated-order-detail/components/ExchangeDetail/modules/constants";
import PrintLabel from "@/features/integrated-order-detail/components/PrintLabel";
import usePatchExchangeCancel from "@/features/integrated-order-detail/hooks/usePatchExchangeCancel";
import usePatchExchangeRequestShipment from "@/features/integrated-order-detail/hooks/usePatchExchangeRequestShipment";
import {
  transformExchangeDetail,
  transformRowsExchangeDetail,
} from "@/features/integrated-order-detail/models/transforms";
import {
  LIST_COLUMNS_RETURN_DETAIL,
  LIST_COLUMNS_PRODUCT_INSPECTION_RESULT,
} from "@/features/integrated-order-detail/modules/columns";
import { NOT_STARTED } from "@/features/integrated-order-detail/modules/constants";
import { DATA_GRID_STYLES_PRODUCT_INSPECTION } from "@/features/integrated-order-detail/modules/styles";
import { getRecipientPhone } from "@/features/integrated-order-detail/modules/utils";
import { DATA_GRID_STYLES } from "@/features/integrated-order-list/modules/styles";

import {
  DetailGrid,
  DetailGridSingle,
} from "@/shared/components/table/tableStyle";
import { Cell } from "@/shared/components/table/tableStyle";
import Title from "@/shared/components/text/Title";
import {
  ExchangeDetailResponse,
  ExchangeSearchRequestExchangeStatusesEnum,
} from "@/shared/generated/oms/types/Exchange";
import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";
import { MUIDataGridTheme } from "@/shared/styles/theme";
import { formatAddress, getDisabledText } from "@/shared/utils/stringUtils";

import IconArrowDropDownFilled from "@/assets/icons/IconArrowDropDownFilled";

interface Props {
  exchangeData: ExchangeDetailResponse;
  corporation?: string;
  brand?: string;
}
export default function ExchangeDetailInfo({
  exchangeData,
  corporation,
  brand,
}: Props) {
  const { CANCELED } = ExchangeSearchRequestExchangeStatusesEnum;

  const { timezone } = useTimezoneStore();
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();
  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const { mutate: mutateCancelExchange } = usePatchExchangeCancel({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.exchangeDetail(orderId),
      });
      setOpen(null);
    },
  });

  const { mutate: mutateRequestShipment } = usePatchExchangeRequestShipment({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.exchangeDetail(orderId),
      });
      setOpen(null);
    },
  });

  const exchangeDetail = useMemo(
    () => transformExchangeDetail(exchangeData, timezone),
    [exchangeData, timezone],
  );
  const rows = useMemo(
    () => transformRowsExchangeDetail(exchangeData),
    [exchangeData],
  );

  const buttonConditions = useMemo(() => {
    return {
      cancelExchange:
        exchangeData.status.name === "PICKUP_REQUESTED" ||
        exchangeData.status.name === "PICKUP_ONGOING" ||
        exchangeData.status.name === "RECEIVED",
      requestShipment:
        exchangeData.status.name === "PICKUP_REQUESTED" ||
        exchangeData.status.name === "PICKUP_ONGOING" ||
        exchangeData.status.name === "RECEIVED" ||
        exchangeData.status.name === "INSPECTED",
    };
  }, [exchangeData]);

  return (
    <div className="mx-[24px] rounded-[5px] border border-outlined bg-white">
      {/* title */}
      <button
        className="flex w-full items-center gap-[8px] bg-exchange p-[16px] text-[14px] font-medium text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <IconArrowDropDownFilled />
        ) : (
          <IconArrowDropDownFilled className="rotate-[270deg]" />
        )}
        <p className="text-[16px] font-bold">#{exchangeData.exchangeNo}</p>
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
                  rows={exchangeDetail.productInspectionResult}
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
              <Cell>{exchangeDetail.registeredBy}</Cell>
            </div>
            <div>
              <h3>Exchange reason</h3>
              <Cell>{exchangeDetail.exchangeReason}</Cell>
            </div>
          </DetailGrid>
          <DetailGridSingle>
            <div>
              <h3>Status</h3>
              <Cell>
                <Chip label={exchangeDetail.exchangeStatus} color="success" />
                <span className="ml-[17px] text-[13px] font-medium text-[rgba(0,0,0,0.38)]">
                  {exchangeDetail.returnUpdatedDate}
                </span>

                <div className="ml-auto flex gap-[8px]">
                  {buttonConditions.requestShipment && (
                    <ExchangeActionButton
                      modalKey="REQUEST_SHIPMENT"
                      open={open}
                      setOpen={setOpen}
                      text={
                        exchangeDetail.exchangeStatus !== "Inspected"
                          ? MODAL_TEXT.REQUEST_SHIPMENT_TEXT_BEFORE_INSPECTION
                          : MODAL_TEXT.REQUEST_SHIPMENT_TEXT_AFTER_INSPECTION
                      }
                      dialogCloseLabel="Cancel"
                      dialogConfirmLabel="Confirm"
                      onConfirm={() =>
                        mutateRequestShipment(exchangeData.exchangeId)
                      }
                      buttonLabel="Request Shipment"
                      closeButtonClassNames="!text-error"
                    />
                  )}

                  {buttonConditions.cancelExchange && (
                    <ExchangeActionButton
                      modalKey="CHANGE_TO_CANCEL"
                      open={open}
                      setOpen={setOpen}
                      text={MODAL_TEXT.CANCEL_EXCHANGE_TEXT}
                      dialogCloseLabel="Keep Exchange"
                      dialogConfirmLabel="Cancel Exchange"
                      onConfirm={() =>
                        mutateCancelExchange(exchangeData.exchangeId)
                      }
                      buttonLabel="Cancel Exchange"
                      closeButtonClassNames="!text-default"
                      postButtonClassNames="!text-error"
                    />
                  )}
                </div>
              </Cell>
            </div>
          </DetailGridSingle>
          <DetailGrid>
            <div>
              <h3>Recipient Name</h3>
              <Cell>{exchangeDetail.recipientName}</Cell>
            </div>
            <div>
              <h3>Recipient No</h3>
              <Cell>
                {getRecipientPhone(
                  exchangeDetail.phoneCountryNo,
                  exchangeDetail.recipientPhone,
                )}
              </Cell>
            </div>
          </DetailGrid>

          {/* Pickup */}
          <div className="m-[16px] rounded-[5px] border border-solid border-[#E0E0E0]">
            <h3 className="p-[16px] text-[16px] font-bold">
              Pickup #{exchangeDetail.exchangeNo}
            </h3>
            <DetailGridSingle className="border-t border-solid border-[#E0E0E0]">
              <div>
                <h3>Pickup Address</h3>
                <Cell>
                  {formatAddress(
                    exchangeDetail.pickupAddress.postcode,
                    exchangeDetail.pickupAddress.countryRegion,
                    exchangeDetail.pickupAddress.stateProvince,
                    exchangeDetail.pickupAddress.city,
                    exchangeDetail.pickupAddress.address1,
                    exchangeDetail.pickupAddress.address2,
                  )}
                </Cell>
              </div>
            </DetailGridSingle>
            <DetailGrid>
              <div>
                <h3>Carrier</h3>
                <Cell>
                  <span
                    className={`${getDisabledText(exchangeDetail.carrier, NOT_STARTED)}`}
                  >
                    {exchangeDetail.carrier}
                  </span>
                </Cell>
              </div>
              <div>
                <h3>Tracking No</h3>
                <Cell>
                  <span
                    className={`${getDisabledText(exchangeDetail.trackingNo, NOT_STARTED)}`}
                  >
                    {exchangeDetail.trackingNo}
                  </span>
                  <div className="ml-auto">
                    <Button
                      color="primary"
                      size="small"
                      className="!ml-auto"
                      disabled={!exchangeDetail.trackingUrl}
                      onClick={() => {
                        if (exchangeDetail.trackingUrl) {
                          window.open(exchangeDetail.trackingUrl, "_blank");
                        }
                      }}
                    >
                      Track shipping
                    </Button>
                  </div>
                </Cell>
              </div>
            </DetailGrid>
          </div>

          {/* Re-Shipment */}
          {exchangeDetail.resendInfo.map((resend, index) => (
            <div
              key={index}
              className="m-[16px] rounded-[5px] border border-solid border-[#E0E0E0]"
            >
              <h3 className="flex items-center gap-[6px] p-[16px] text-[16px] font-bold">
                Shipment #{resend.shipmentNo}
                <CopyTextButton text={resend.shipmentNo} />
              </h3>

              <DetailGridSingle className="border-t border-solid border-[#E0E0E0]">
                <div>
                  <h3>Status</h3>
                  <Cell>
                    <Chip label={resend.status} />
                    <span className="ml-[17px] text-[13px] font-medium text-[rgba(0,0,0,0.38)]">
                      {resend.updatedAt}
                    </span>

                    <div className="ml-auto flex gap-[8px]">
                      {resend.status === "Picking Rejected" && (
                        <ExchangeActionButton
                          modalKey="REQUEST_SHIPMENT"
                          open={open}
                          setOpen={setOpen}
                          text={
                            MODAL_TEXT.REQUEST_SHIPMENT_TEXT_PICKING_REJECTED
                          }
                          dialogCloseLabel="Cancel"
                          dialogConfirmLabel="Confirm"
                          onConfirm={() =>
                            mutateRequestShipment(exchangeData.exchangeId)
                          }
                          buttonLabel="Request Shipment"
                          closeButtonClassNames="!text-error"
                        />
                      )}
                      {resend.status === "Picking Requested" && (
                        <>
                          <ExchangeActionButton
                            modalKey={`CANCEL_SHIPMENT_${index}`}
                            open={open}
                            setOpen={setOpen}
                            text="Are you sure you want to cancel this shipment? This action requires WMS confirmation."
                            dialogCloseLabel="Keep Shipment"
                            dialogConfirmLabel="Cancel Shipment"
                            onConfirm={() => {
                              // Mock: Cancel shipment API call
                              setOpen(null);
                            }}
                            buttonLabel="Cancel Shipment"
                            postButtonClassNames="!text-error"
                          />
                        </>
                      )}
                    </div>
                  </Cell>
                </div>
              </DetailGridSingle>

              {/* Label Status - GM brand + CA channel only */}
              {brand === "GENTLE_MONSTER" && corporation === "CA" && (
                <DetailGridSingle>
                  <div>
                    <h3>Label Status</h3>
                    <Cell>
                      <Chip
                        label={
                          resend.status === "Picking Requested"
                            ? "Unprinted"
                            : "Printed"
                        }
                        sx={
                          resend.status === "Picking Requested"
                            ? {
                                backgroundColor: "#e4a343",
                                color: "#fff",
                              }
                            : {
                                backgroundColor: "#e0e0e0",
                                color: "rgba(0,0,0,0.87)",
                              }
                        }
                      />
                      <div className="ml-auto flex gap-[8px]">
                        <PrintLabel
                          shipmentNo={resend.shipmentNo}
                          shipmentStatus={
                            resend.status === "Picking Requested"
                              ? "PICKING_REQUESTED"
                              : "PICKED"
                          }
                          orderId={orderId ?? ""}
                          recipientName={exchangeDetail.recipientName}
                          recipientCompany="IIC Combined"
                          recipientAddress={
                            exchangeDetail.resendAddress.address1
                          }
                          recipientCityStateZip={`${exchangeDetail.resendAddress.city} ${exchangeDetail.resendAddress.stateProvince} ${exchangeDetail.resendAddress.postcode}`}
                          recipientCountry={
                            exchangeDetail.resendAddress.countryRegion
                          }
                          recipientPhone={exchangeDetail.recipientPhone}
                          trackingNo={
                            resend.resendDeliveries[0]?.trackingNo ?? ""
                          }
                        />
                      </div>
                    </Cell>
                  </div>
                </DetailGridSingle>
              )}

              <DetailGridSingle>
                <div>
                  <h3>Pickup Address</h3>
                  <Cell>
                    {formatAddress(
                      exchangeDetail.resendAddress.postcode,
                      exchangeDetail.resendAddress.countryRegion,
                      exchangeDetail.resendAddress.stateProvince,
                      exchangeDetail.resendAddress.city,
                      exchangeDetail.resendAddress.address1,
                      exchangeDetail.resendAddress.address2,
                    )}
                  </Cell>
                </div>
              </DetailGridSingle>

              <div key={index}>
                <DetailGrid>
                  <div>
                    <h3>Carrier</h3>
                    <Cell>
                      <span
                        className={`${getDisabledText(resend.resendShipCo, NOT_STARTED)} ${getDisabledText(resend.resendWMSNo, CANCELED)}`}
                      >
                        {resend.resendShipCo}
                      </span>
                    </Cell>
                  </div>

                  <div>
                    <h3>Tracking No</h3>
                    <Cell>
                      <div className="flex w-full flex-col gap-[12px]">
                        {resend.resendDeliveries.map((delivery) => (
                          <div
                            key={delivery.trackingNo}
                            className="flex w-full items-center justify-between"
                          >
                            <span
                              className={`${getDisabledText(delivery.trackingNo, NOT_STARTED)} ${getDisabledText(delivery.trackingNo, CANCELED)}`}
                            >
                              {delivery.trackingNo}
                            </span>
                            <div className="ml-auto">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </Cell>
                  </div>
                </DetailGrid>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
