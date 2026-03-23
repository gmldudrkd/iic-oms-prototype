import {
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  DialogProps,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";

import usePostVerifyChangePasswordEmail from "@/features/change-password/hooks/usePostVerifyChangePasswordEmail";

import CustomInput from "@/shared/components/form-elements/CustomInput";
import { UserEmailRequest } from "@/shared/generated/auth/types/Auth";

interface ForgotPasswordModalProps extends DialogProps {
  handleCloseForgotPasswordModal: () => void;
}

export default function ForgotPasswordModal({
  open,
  handleCloseForgotPasswordModal,
}: ForgotPasswordModalProps) {
  const methods = useForm<UserEmailRequest>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const handleClose = () => {
    methods.reset();
    handleCloseForgotPasswordModal();
  };

  const { mutate: postVerifyChangePasswordEmail } =
    usePostVerifyChangePasswordEmail();

  const handleSubmit = methods.handleSubmit((data) => {
    postVerifyChangePasswordEmail(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap="36px"
          padding="30px"
          onSubmit={handleSubmit}
        >
          <DialogTitle sx={{ padding: "0px" }}>Forgot Password</DialogTitle>
          <DialogContent sx={{ padding: "0px" }}>
            <CustomInput
              {...methods.register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              textFieldProps={{
                variant: "standard",
                fullWidth: true,
                label: "Email",
                placeholder: "Please enter your email",
                error: !!methods.formState.errors.email,
                helperText: methods.formState.errors.email?.message as string,
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
            }}
          >
            <Typography fontSize="10px" color="text.secondary">
              You will receive a password change link via email.
            </Typography>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </FormProvider>
  );
}
