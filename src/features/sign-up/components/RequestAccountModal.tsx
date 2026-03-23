import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  DialogProps,
  DialogActions,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

import BrandCorpTable from "@/features/sign-up/components/BrandCorpTable";
import { usePostRequestAccount } from "@/features/sign-up/hooks/usePostRequestAccount";
import useRequestAccountForm from "@/features/sign-up/hooks/useRequestAccountForm";
import { validatePassword } from "@/features/sign-up/modules/utils";

import CustomInput from "@/shared/components/form-elements/CustomInput";
import { UserCreateRequestRoleEnum } from "@/shared/generated/auth/types/Auth";
import useHandlePasswordInput from "@/shared/hooks/useHandlePasswordInput";

interface RequestAccountModalProps extends DialogProps {
  handleCloseRequestAccountModal: () => void;
}

export default function RequestAccountModal({
  open,
  handleCloseRequestAccountModal,
}: RequestAccountModalProps) {
  const {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
  } = useHandlePasswordInput();

  const { methods, handleSelectBrands, isSelected } = useRequestAccountForm();

  const { mutate: postRequestAccount } = usePostRequestAccount();

  const handleSubmit = methods.handleSubmit((data) => {
    postRequestAccount(
      {
        email: data.email,
        password: data.password,
        reason: data.reason,
        role: UserCreateRequestRoleEnum.MANAGER,
        permissions: data.permissions,
      },
      {
        onSuccess: () => {
          handleCloseRequestAccountModal();
        },
      },
    );
  });

  useEffect(() => {
    methods.reset();
  }, [open, methods]);

  return (
    <Dialog
      open={open}
      onClose={handleCloseRequestAccountModal}
      maxWidth="sm"
      fullWidth
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap="36px"
          padding="30px"
        >
          <DialogTitle sx={{ padding: "0px" }}>Request Account</DialogTitle>
          <DialogContent sx={{ padding: "0px" }}>
            <Box display="flex" flexDirection="column" gap="17px">
              <Typography>Fill the Basic Info</Typography>
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
              <CustomInput
                {...methods.register("password", {
                  required: "Please enter your password",
                  validate: validatePassword,
                })}
                textFieldProps={{
                  variant: "standard",
                  fullWidth: true,
                  type: showPassword ? "text" : "password",
                  label: "Password",
                  placeholder: "Please enter your password",
                  error: !!methods.formState.errors.password,
                  helperText: methods.formState.errors.password
                    ?.message as string,
                  slotProps: {
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                            sx={{
                              marginRight: "0px",
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="17px" mt="36px">
              <Typography>
                Select each brand and corporation you want to access
              </Typography>
              <BrandCorpTable
                handleSelectBrands={handleSelectBrands}
                isSelected={isSelected}
              />

              <CustomInput
                {...methods.register("reason", {
                  required: "Please enter the reason for the request",
                })}
                textFieldProps={{
                  variant: "standard",
                  fullWidth: true,
                  name: "reason",
                  label: "Reason",
                  placeholder: "Please enter the reason for the request",
                  error: !!methods.formState.errors.reason,
                  helperText: methods.formState.errors.reason
                    ?.message as string,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
            }}
          >
            <Typography fontSize="10px" color="text.secondary">
              ** Please note that It will be processed in a working day
            </Typography>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
