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
import { ONLINE_STOCK_HISTORY_EVENTS } from "@/features/stock/history/modules/constants";

import { OnlineStockHistoryRequestEventsEnum } from "@/shared/generated/oms/types/Stock";

export default function OnlineStockHistoryFilter() {
  const MAX_DISPLAY = 3;
  const { watch, setValue } = useFormContext<StockHistoryDetailParamsForm>();
  const events = watch("onlineStockHistory.events");
  const isEventsEmpty = events && events.length === 0;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setValue(
      "onlineStockHistory.events",
      (typeof value === "string"
        ? value.split(",")
        : value) as OnlineStockHistoryRequestEventsEnum[],
    );
  };

  const handleDeleteEvent =
    (event: OnlineStockHistoryRequestEventsEnum) => (e: React.MouseEvent) => {
      e.stopPropagation();
      const events = watch("onlineStockHistory.events") || [];
      setValue(
        "onlineStockHistory.events",
        events.filter((e) => e !== event),
      );
    };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("onlineStockHistory.events", []);
  };

  return (
    <FormControl>
      <InputLabel id="online-stock-history-event-label">Event</InputLabel>
      <Select
        labelId="online-stock-history-event-label"
        multiple
        value={events}
        onChange={handleChange}
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
                  label={ONLINE_STOCK_HISTORY_EVENTS[value]}
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
        {Object.values(OnlineStockHistoryRequestEventsEnum).map((name) => (
          <MenuItem key={name} value={name}>
            {ONLINE_STOCK_HISTORY_EVENTS[name]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
