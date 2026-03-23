import { FormControl, MenuItem, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";

// 상수 정의
export const COLORS = {
  WHITE: "white",
  ERROR: "#C62828",
  BORDER: "#e0e0e0",
} as const;

export const SIZES = {
  WIDTH: 180,
} as const;

// Styled Components
export const StyledFormControl = styled(FormControl)(() => ({
  width: SIZES.WIDTH,
  "& .MuiSelect-root:hover:before": {
    borderBottomColor: COLORS.WHITE,
  },
  "& .MuiInputLabel-root": {
    color: COLORS.WHITE,
    "&.Mui-focused": { color: COLORS.WHITE },
  },
  "& .MuiInput-underline": {
    "&:before": { borderBottomColor: COLORS.WHITE },
    "&:hover:before": { borderBottomColor: `${COLORS.WHITE} !important` },
    "&:after": { borderBottomColor: COLORS.WHITE },
  },
  "& .MuiSelect-icon": { color: COLORS.WHITE },
  "& .MuiInputBase-input": { color: COLORS.WHITE },
}));

export const StyledAllMenuItem = styled(MenuItem)(() => ({
  borderTop: `1px solid ${COLORS.BORDER}`,
}));

export const StyledFormHelperText = styled(FormHelperText)(() => ({
  color: COLORS.ERROR,
  marginTop: 0,
  paddingTop: "8px",
  textAlign: "center",
  borderTop: `1px solid ${COLORS.BORDER}`,
}));
