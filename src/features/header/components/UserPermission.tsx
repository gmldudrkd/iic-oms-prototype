"use client";

import {
  Checkbox,
  ListItemText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { usePathname } from "next/navigation";

import { useUserPermission } from "@/features/header/hooks/useUserPermission";
import {
  DISABLE_PATHS,
  BRAND_CORP_HIDDEN_PATHS,
} from "@/features/header/modules/constants";
import {
  StyledFormControl,
  StyledAllMenuItem,
  StyledFormHelperText,
  COLORS,
} from "@/features/header/modules/styles";
import { formatSelectedValue } from "@/features/header/modules/utils";

export default function UserPermission() {
  const pathname = usePathname();

  const {
    allLabels,
    selectedLabels,
    isShowError,
    open,
    isAllSelected,
    isMultiple,
    handleChange,
    handleClose,
    handleOpen,
  } = useUserPermission();

  if (BRAND_CORP_HIDDEN_PATHS.some((path) => pathname.includes(path)))
    return null;

  return (
    <StyledFormControl variant="standard">
      <InputLabel
        required
        shrink={true}
        sx={{
          "& .MuiFormLabel-asterisk": { color: COLORS.ERROR },
        }}
      >
        Brand & Corp
      </InputLabel>

      {isMultiple ? (
        <Select
          multiple
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={selectedLabels}
          onChange={handleChange}
          renderValue={formatSelectedValue}
          MenuProps={{ autoFocus: false }}
        >
          {allLabels.map((label, index) => (
            <MenuItem key={`${label}-${index}`} value={label}>
              <Checkbox checked={selectedLabels.includes(label)} />
              <ListItemText primary={label} />
            </MenuItem>
          ))}

          <StyledAllMenuItem value="all">
            <Checkbox
              checked={isAllSelected}
              indeterminate={selectedLabels.length > 0 && !isAllSelected}
            />
            <ListItemText primary="ALL" />
          </StyledAllMenuItem>

          {isShowError && (
            <StyledFormHelperText>
              Select at least one option.
            </StyledFormHelperText>
          )}
        </Select>
      ) : (
        <Select
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={selectedLabels}
          onChange={handleChange}
          renderValue={formatSelectedValue}
          MenuProps={{ autoFocus: false }}
          disabled={DISABLE_PATHS.some((path) => pathname.includes(path))}
          sx={{
            "& .Mui-disabled": {
              WebkitTextFillColor: COLORS.WHITE,
              color: COLORS.WHITE,
              opacity: 0.5,
              ".MuiSvgIcon-root": {
                opacity: 0.5,
              },
            },
          }}
        >
          {allLabels.map((label, index) => (
            <MenuItem key={`${label}-${index}`} value={label}>
              <ListItemText primary={label} />
            </MenuItem>
          ))}
        </Select>
      )}
    </StyledFormControl>
  );
}
