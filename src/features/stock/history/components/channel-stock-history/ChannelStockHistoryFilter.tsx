import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

import { StockHistoryDetailParamsForm } from "@/features/stock/history/models/types";
import { CHANNEL_STOCK_HISTORY_EVENTS } from "@/features/stock/history/modules/constants";

import {
  ChannelStockHistoryRequestChannelTypesEnum,
  ChannelStockHistoryRequestEventsEnum,
} from "@/shared/generated/oms/types/Stock";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export default function ChannelStockHistoryFilter() {
  const MAX_DISPLAY = 3;
  const { watch, setValue } = useFormContext<StockHistoryDetailParamsForm>();
  const { selectedPermission } = useUserPermissionStore();

  const channelList: {
    label: string;
    value: ChannelStockHistoryRequestChannelTypesEnum;
  }[] = selectedPermission[0]?.corporations[0]?.channels.map((channel) => ({
    label: channel.description ?? "",
    value: channel.name as ChannelStockHistoryRequestChannelTypesEnum,
  }));

  const events = watch("channelStockHistory.events");
  const channelTypes = watch("channelStockHistory.channelTypes");
  const isEventsEmpty = events && events.length === 0;

  const handleChangeEvents = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setValue(
      "channelStockHistory.events",
      (typeof value === "string"
        ? value.split(",")
        : value) as ChannelStockHistoryRequestEventsEnum[],
    );
  };

  const handleDeleteEvent =
    (event: ChannelStockHistoryRequestEventsEnum) => (e: React.MouseEvent) => {
      e.stopPropagation();
      const events = watch("channelStockHistory.events") || [];
      setValue(
        "channelStockHistory.events",
        events.filter((e) => e !== event),
      );
    };

  const handleChangeChannelTypes = (
    event: SelectChangeEvent<ChannelStockHistoryRequestChannelTypesEnum>,
  ) => {
    const { value } = event.target;
    setValue(
      "channelStockHistory.channelTypes",
      value as ChannelStockHistoryRequestChannelTypesEnum,
    );
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("channelStockHistory.events", []);
  };

  return (
    <Box display="flex" gap="10px">
      <FormControl sx={{ width: "220px" }}>
        <InputLabel id="channel-stock-history-channel-label">
          Channel <span style={{ color: "red" }}>*</span>
        </InputLabel>
        <Select
          labelId="channel-stock-history-channel-label"
          label="Channel"
          value={channelTypes}
          onChange={handleChangeChannelTypes}
        >
          {channelList.map((channel) => (
            <MenuItem key={channel.value} value={channel.value}>
              {channel.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="channel-stock-history-event-label">Event</InputLabel>
        <Select
          labelId="channel-stock-history-event-label"
          multiple
          value={events}
          onChange={handleChangeEvents}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Event"
              sx={{
                "& .MuiSelect-select": {
                  minWidth: "200px",
                  padding: isEventsEmpty ? "16.5px 14px" : "12px 14px",
                  paddingRight: "0px !important",
                },
              }}
              endAdornment={
                events &&
                events.length > 0 && (
                  <InputAdornment position="end" sx={{ mr: 2 }}>
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      edge="end"
                      aria-label="clear selection"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
          }
          renderValue={(selected) => {
            const displayValues = selected.slice(0, MAX_DISPLAY);
            const extraCount = selected.length - MAX_DISPLAY;

            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {displayValues.map((value) => (
                  <Chip
                    key={value}
                    label={CHANNEL_STOCK_HISTORY_EVENTS[value]}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDelete={handleDeleteEvent(value)}
                  />
                ))}

                {extraCount > 0 && (
                  <Chip
                    label={`+${extraCount}`}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                )}
              </Box>
            );
          }}
        >
          {Object.values(ChannelStockHistoryRequestEventsEnum).map((name) => (
            <MenuItem key={name} value={name}>
              {CHANNEL_STOCK_HISTORY_EVENTS[name]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
