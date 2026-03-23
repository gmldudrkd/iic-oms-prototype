import { Box, Typography, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

import CustomInput from "@/shared/components/form-elements/CustomInput";

interface VerifyCodeProps {
  qrCodeUri: string | null;
  handleSubmit: () => void;
}

export default function VerifyCode({
  qrCodeUri,
  handleSubmit,
}: VerifyCodeProps) {
  const methods = useFormContext();

  return (
    <Box
      component="form"
      width="345px"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="20px"
    >
      <Typography fontSize="20px" fontWeight={500}>
        Two-Factor Authentication
      </Typography>
      {qrCodeUri && (
        <>
          <Typography fontSize="12px">
            Scan this QR code using the Google Authenticator app.
          </Typography>

          <img src={qrCodeUri} alt="QR Code" />
        </>
      )}
      <Typography fontSize="12px">
        Enter the 6-digit code from your Google Authenticator app.
      </Typography>

      <CustomInput
        {...methods.register("code", {
          required: "Please enter 6-digit-code.",
          pattern: {
            value: /^[0-9]{6}$/,
            message: "Please enter 6-digit-code.",
          },
        })}
        textFieldProps={{
          fullWidth: true,
          placeholder: "6-digit-code",
          autoFocus: true,
        }}
      />

      <Button type="submit" fullWidth variant="contained">
        Verify
      </Button>
    </Box>
  );
}
