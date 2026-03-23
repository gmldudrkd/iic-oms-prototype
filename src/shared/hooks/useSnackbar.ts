import { useState } from "react";

interface SnackbarOptions {
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  title?: string;
  showUndo?: boolean;
  onUndo?: () => void;
}

export const useSnackbar = (defaultOptions?: SnackbarOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions>({
    message: "",
    ...(defaultOptions ?? {}),
  });

  const openSnackbar = (newOptions?: SnackbarOptions) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...(newOptions ?? {}),
    }));
    setIsOpen(true);
  };

  const closeSnackbar = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    options,
    openSnackbar,
    closeSnackbar,
  };
};
