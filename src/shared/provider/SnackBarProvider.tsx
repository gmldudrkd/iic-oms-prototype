"use client";

import CustomSnackbar from "@/shared/components/CustomSnackbar";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isOpen,
    message,
    severity,
    alertTitle,
    autoHideDuration,
    closeSnackbar,
    closeButton,
    alertVariant,
  } = useSnackbarStore();

  return (
    <>
      {children}
      <CustomSnackbar
        open={isOpen}
        message={message}
        severity={severity}
        alertTitle={alertTitle}
        onClose={closeSnackbar}
        autoHideDuration={autoHideDuration}
        closeButton={closeButton}
        alertVariant={alertVariant}
      />
    </>
  );
};
export default SnackbarProvider;
