import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, ButtonProps } from "@mui/material";
import React from "react";

interface FormActionsProps {
  onReset: () => void;
  onSubmitClick?: () => void;
  submitButtonProps?: ButtonProps;
  hasStartIcon?: boolean;
}

export default function FormActions({
  onReset,
  onSubmitClick,
  submitButtonProps = {},
  hasStartIcon = false,
}: FormActionsProps) {
  return (
    <Box
      className={`flex w-[165px] flex-shrink-0 items-end justify-end gap-[8px]`}
    >
      <Button color="primary" onClick={onReset}>
        Reset
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={hasStartIcon ? <SearchIcon /> : undefined}
        type="submit"
        {...(onSubmitClick && { onClick: onSubmitClick })}
        {...submitButtonProps}
      >
        Search
      </Button>
    </Box>
  );
}
