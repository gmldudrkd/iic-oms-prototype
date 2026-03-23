"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import useGetVerifyEmailCode from "@/features/change-password/hooks/useGetVerifyEmailCode";
import usePatchChangePassword from "@/features/change-password/hooks/usePatchChangePassword";
import { validatePassword } from "@/features/sign-up/modules/utils";

import CustomInput from "@/shared/components/form-elements/CustomInput";
import useHandlePasswordInput from "@/shared/hooks/useHandlePasswordInput";

export default function ChangePassword() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
  } = useHandlePasswordInput();

  const methods = useForm<{ newPassword: string; email: string }>({
    defaultValues: {
      newPassword: "",
      email: "",
    },
    mode: "onChange",
  });

  const { mutate: patchChangePassword } = usePatchChangePassword();
  const {
    data: verifyEmailCode,
    isLoading,
    error,
  } = useGetVerifyEmailCode(code || "");

  useEffect(() => {
    if (verifyEmailCode?.accessToken) {
      try {
        const decodedToken = jwtDecode(verifyEmailCode.accessToken);
        const email = decodedToken.sub as string;
        if (email) {
          methods.setValue("email", email);
        }
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, [verifyEmailCode, methods]);

  if (isLoading) {
    return null;
  }

  if (!code) {
    return <div>Invalid code</div>;
  }

  if (error || !verifyEmailCode) {
    if (error?.status) {
      // 410 에러 (Gone) - 코드가 만료됨
      if (error.status === 410) {
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight={500}>Gone</Typography>
            <Typography fontWeight={500}>410</Typography>
            <Typography fontWeight={500}>
              Access to the target resource is no longer available
            </Typography>
          </Box>
        );
      }

      // 기타 에러
      return <div>Invalid or expired code</div>;
    }
  }

  const handleSubmit = methods.handleSubmit((data) => {
    if (!verifyEmailCode) return;

    patchChangePassword({
      data: {
        password: data.newPassword,
      },
      token: verifyEmailCode.accessToken,
    });
  });

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        width="345px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        onSubmit={handleSubmit}
      >
        <Typography fontSize="20px" fontWeight={500} lineHeight="160%">
          Change Password
        </Typography>
        <Typography fontSize="12px" fontWeight={400} lineHeight="166%">
          Enter the new password
        </Typography>

        <CustomInput
          {...methods.register("email")}
          textFieldProps={{
            label: "Email",
            placeholder: "example@gentlemonster.com",
            type: "email",
            variant: "standard",
            fullWidth: true,
            disabled: true,
          }}
        />

        <CustomInput
          {...methods.register("newPassword", {
            required: "Please enter your password",
            validate: validatePassword,
          })}
          textFieldProps={{
            placeholder: "New Password",
            type: showPassword ? "text" : "password",
            variant: "standard",
            fullWidth: true,
            label: "New Password",
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
            sx: {
              marginTop: "10px",
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ marginTop: "30px" }}
        >
          Change
        </Button>
      </Box>
    </FormProvider>
  );
}
