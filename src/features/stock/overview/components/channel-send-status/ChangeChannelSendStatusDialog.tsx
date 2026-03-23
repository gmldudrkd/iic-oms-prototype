import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ThemeProvider,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { red } from "@mui/material/colors";
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChangeEvent, useState } from "react";

import ChangeChannelSendStatusSaveAlerts, {
  AlertType,
} from "@/features/stock/overview/components/channel-send-status/ChangeChannelSendStatusSaveAlerts";
import useChangeChannelSendStatusValidation from "@/features/stock/overview/hooks/channel-send-status/useChangeChannelSendStatusValidation";
import usePatchChannelSendStatus from "@/features/stock/overview/hooks/channel-send-status/usePatchChannelSendStatus";
import { ChannelStockData } from "@/features/stock/overview/models/transforms";
import { OffPeriod } from "@/features/stock/overview/models/types";
import {
  CHANNEL_SEND_STATUS_LIST,
  LINK_TYPE_MAP,
} from "@/features/stock/overview/modules/constants";

import Title from "@/shared/components/text/Title";
import {
  StockDashboardRequestChannelSendStatusEnum,
  StockSyncTargetChannelTypeEnum,
} from "@/shared/generated/oms/types/Stock";
import useCurrentTime from "@/shared/hooks/useCurrentTime";
import { MUIDataGridTheme } from "@/shared/styles/theme";

interface ChangeChannelSendStatusDialogProps {
  offPeriod: OffPeriod;
  setOffPeriod: (offPeriod: OffPeriod) => void;
  rows: {
    sku: string;
    channelStocks: ChannelStockData[];
    id: string;
    productName: string;
    singleSku: string;
  }[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ChangeChannelSendStatusDialog({
  offPeriod,
  setOffPeriod,
  rows,
  open,
  setOpen,
}: ChangeChannelSendStatusDialogProps) {
  const { channelSendStatus, startDate, endDate } = offPeriod;
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);
  const { UpdatedAt } = useCurrentTime({
    isFetching: false,
    isSuccess: open,
    format: "YYYY-MM-DD hh:mm:ss A",
  });

  const handleChangeChannelSendStatus = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const status = event.target
      .value as StockDashboardRequestChannelSendStatusEnum;

    setOffPeriod({
      channelSendStatus: status,
      startDate:
        status === StockDashboardRequestChannelSendStatusEnum.OFF
          ? dayjs()
          : null,
      endDate: undefined,
    });
    setActiveAlert(null);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveAlert(null);
    setOffPeriod({
      channelSendStatus: StockDashboardRequestChannelSendStatusEnum.ON,
      startDate: null,
      endDate: undefined,
    });
  };

  const handleDialogClose = (
    event: React.SyntheticEvent | Event,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick") return;
    handleClose();
  };

  const columns: GridColDef[] = [
    { field: "singleSku", headerName: "SKU Code", flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",

      flex: 1.4,
    },
    {
      field: "channelStocks",
      headerName: "Channels",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        return (
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            height="100%"
            padding="10px 16px"
          >
            {value
              .filter(
                (channel: ChannelStockData) => channel.channel !== "Total",
              )
              .map((channel: ChannelStockData) => (
                <Typography
                  key={channel.channel}
                  fontSize="14px"
                  fontWeight="bold"
                  lineHeight="24px"
                >
                  {channel.channel}
                </Typography>
              ))}
          </Box>
        );
      },
    },
  ];

  const { mutate: patchChannelSendStatus } = usePatchChannelSendStatus();
  const { validateChangeChannelSendSaveStatus } =
    useChangeChannelSendStatusValidation();

  const handleSave = () => {
    if (channelSendStatus === StockDashboardRequestChannelSendStatusEnum.OFF) {
      const validationError = validateChangeChannelSendSaveStatus(offPeriod);
      if (validationError) {
        setActiveAlert(validationError);
        return;
      }
    }

    patchChannelSendStatus(
      {
        targets: rows.flatMap((row) =>
          row.channelStocks.map((channel) => ({
            channelType: channel.channelEnum as StockSyncTargetChannelTypeEnum,
            sku: row.singleSku,
          })),
        ),
        unlinkStartedAt: startDate?.toISOString() ?? "",
        unlinkEndedAt: endDate?.toISOString() ?? "",
        linkType: LINK_TYPE_MAP[channelSendStatus],
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle bgcolor="primary.main">
          <div className="flex items-center justify-between">
            <Typography fontSize="20px" fontWeight="bold" color="white">
              Change Channel Send Status
            </Typography>

            <UpdatedAt sx={{ fontSize: "13px", color: "white" }} />
          </div>
        </DialogTitle>
        <DialogContent sx={{ padding: "20px 24px", marginTop: "20px" }}>
          <Box border="1px solid #E0E0E0" borderRadius="5px">
            <Title text="Selected Products" variant="bordered" />
            <ThemeProvider theme={MUIDataGridTheme}>
              <DataGridPro
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                getRowHeight={() => "auto"}
                hideFooter
                columnHeaderHeight={36}
                sx={{
                  height: "360px",
                }}
              />
            </ThemeProvider>

            <Box display="flex" borderTop="1px solid #E0E0E0">
              <Box
                p="16px"
                bgcolor="rgba(33, 150, 243, 0.08)"
                borderRight="1px solid #E0E0E0"
                width="240px"
              >
                <Typography fontSize="16px" fontWeight="bold">
                  Channel Send Status
                </Typography>
              </Box>
              <Box p="10px" display="flex" alignItems="center" flexGrow={1}>
                <FormControl>
                  <RadioGroup
                    value={channelSendStatus}
                    onChange={handleChangeChannelSendStatus}
                    sx={{
                      flexDirection: "row",
                    }}
                  >
                    {CHANNEL_SEND_STATUS_LIST.map((status) => (
                      <FormControlLabel
                        key={status.value}
                        value={status.value}
                        control={<Radio />}
                        label={status.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>

            {channelSendStatus ===
              StockDashboardRequestChannelSendStatusEnum.OFF && (
              <>
                <Box display="flex" borderTop="1px solid #E0E0E0">
                  <Box
                    p="16px"
                    bgcolor="rgba(33, 150, 243, 0.08)"
                    borderRight="1px solid #E0E0E0"
                    width="240px"
                  >
                    <Box display="flex" alignItems="center" gap="4px">
                      <Typography fontSize="16px" fontWeight="bold">
                        Start Date
                      </Typography>
                    </Box>
                  </Box>
                  <Box p="10px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) =>
                          setOffPeriod({
                            ...offPeriod,
                            startDate: newValue,
                          })
                        }
                        format="YYYY-MM-DD hh:mm A"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box display="flex" borderTop="1px solid #E0E0E0">
                  <Box
                    p="16px"
                    bgcolor="rgba(33, 150, 243, 0.08)"
                    borderRight="1px solid #E0E0E0"
                    width="240px"
                  >
                    <Box display="flex" alignItems="center" gap="4px">
                      <Typography fontSize="16px" fontWeight="bold">
                        End Date
                      </Typography>
                    </Box>
                  </Box>
                  <Box p="10px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box display="flex" alignItems="center" gap="12px">
                        <DateTimePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) =>
                            setOffPeriod({
                              ...offPeriod,
                              endDate: newValue,
                            })
                          }
                          disabled={endDate === null}
                          format="YYYY-MM-DD hh:mm A"
                          minDateTime={startDate ?? dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                            },
                          }}
                        />
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={endDate === null}
                                onChange={(event) =>
                                  setOffPeriod({
                                    ...offPeriod,
                                    endDate: event.target.checked
                                      ? null
                                      : undefined,
                                  })
                                }
                              />
                            }
                            label="Indefinite"
                          />
                        </FormGroup>
                      </Box>
                    </LocalizationProvider>
                  </Box>
                </Box>
              </>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Typography fontSize="12px" color={red[500]} fontWeight="bold">
              ⚠ Changes will apply starting with the next stock distribution.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ "&": { padding: "0 24px 24px 24px" } }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ChangeChannelSendStatusSaveAlerts
        activeAlert={activeAlert}
        onClose={() => setActiveAlert(null)}
      />
    </>
  );
}
