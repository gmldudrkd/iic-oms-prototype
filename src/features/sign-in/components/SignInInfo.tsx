"use client";

import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ForgotPasswordModal from "@/features/change-password/components/ForgotPasswordModal";
import RequestAccountModal from "@/features/sign-up/components/RequestAccountModal";

import CustomInput from "@/shared/components/form-elements/CustomInput";

import IICLogoBlack from "@/public/logo/iic/IICLogoBlack";

interface SignInInfoProps {
  handleSubmit: () => void;
}

export default function SignInInfo({ handleSubmit }: SignInInfoProps) {
  const methods = useFormContext();

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const handleOpenForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const [isRequestAccountModalOpen, setIsRequestAccountModalOpen] =
    useState(false);

  const handleOpenRequestAccountModal = () => {
    setIsRequestAccountModalOpen(true);
  };

  const handleCloseRequestAccountModal = () => {
    setIsRequestAccountModalOpen(false);
  };

  return (
    <>
      <h1 className="flex flex-col items-center justify-center">
        <IICLogoBlack />
        <p className="text-medium mt-[15px] text-center">
          Order Management System
        </p>
      </h1>

      <Box component="form" width="345px" onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap="10px" mt="30px">
          <CustomInput
            {...methods.register("email", {
              required: "Please enter your email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            textFieldProps={{
              placeholder: "Email",
              error: !!methods.formState.errors.email,
              helperText: methods.formState.errors.email?.message as string,
              autoFocus: true,
            }}
          />

          <CustomInput
            {...methods.register("password", {
              required: "Please enter your password",
            })}
            textFieldProps={{
              placeholder: "Password",
              type: "password",
              error: !!methods.formState.errors.password,
              helperText: methods.formState.errors.password?.message as string,
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: "30px",
            textTransform: "none",
          }}
        >
          Login
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          mt="10px"
          width="100%"
        >
          <Button
            variant="text"
            sx={{ height: "20px", minHeight: "20px" }}
            onClick={handleOpenForgotPasswordModal}
          >
            Forgot Password?
          </Button>
          <Button
            variant="text"
            sx={{ height: "20px", minHeight: "20px" }}
            onClick={handleOpenRequestAccountModal}
          >
            Request Account {`>`}
          </Button>
        </Box>
      </Box>

      <ForgotPasswordModal
        open={isForgotPasswordModalOpen}
        handleCloseForgotPasswordModal={handleCloseForgotPasswordModal}
      />
      <RequestAccountModal
        open={isRequestAccountModalOpen}
        handleCloseRequestAccountModal={handleCloseRequestAccountModal}
      />
    </>
  );
}
