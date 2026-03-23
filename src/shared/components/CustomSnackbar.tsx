import {
  Alert,
  AlertTitle,
  Box,
  Snackbar as MuiSnackbar,
  Typography,
  type AlertColor,
  type SnackbarProps,
  type SnackbarCloseReason,
} from "@mui/material";
import { useCallback } from "react";

const CustomSnackbar = ({
  closeButton,
  severity = "success",
  alertTitle,
  autoHideDuration = 3000,
  alertVariant = "standard",
  ...props
}: SnackbarProps & {
  closeButton?: React.ReactNode;
  severity?: AlertColor;
  alertTitle?: string;
  autoHideDuration?: number | null;
  alertVariant?: "filled" | "outlined" | "standard";
}) => {
  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
      // autoHideDuration이 null일 때 clickaway로 닫히는 것을 방지
      if (autoHideDuration === null && reason === "clickaway") {
        return;
      }
      props.onClose?.(event, reason);
    },
    [props, autoHideDuration],
  );

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={autoHideDuration}
      {...props}
      onClose={handleClose}
    >
      <Alert
        variant={alertVariant}
        onClose={
          closeButton
            ? undefined
            : (event) => handleClose(event, "escapeKeyDown")
        }
        severity={severity}
        sx={{ width: "100%" }}
        action={
          closeButton ? (
            <Box
              onClick={(event) => handleClose(event, "escapeKeyDown")}
              color="inherit"
              mt="4px"
            >
              {closeButton}
            </Box>
          ) : undefined
        }
      >
        {alertTitle && (
          <AlertTitle sx={{ fontWeight: 500 }}>{alertTitle}</AlertTitle>
        )}
        {typeof props.message === "string" ? (
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {props.message}
          </Typography>
        ) : (
          props.message
        )}
      </Alert>
    </MuiSnackbar>
  );
};

export default CustomSnackbar;
