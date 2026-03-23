"use client";

import { FormProvider } from "react-hook-form";

import SignInInfo from "@/features/sign-in/components/SignInInfo";
import useLoginForm from "@/features/sign-in/hooks/useLoginForm";
import usePostLogin from "@/features/sign-in/hooks/usePostLogin";
import { DeviceInfo } from "@/features/sign-in/models/types";

interface SignInProps {
  deviceInfo: DeviceInfo;
}

export default function SignIn({ deviceInfo }: SignInProps) {
  const { methods } = useLoginForm({
    deviceInfo,
  });

  const { mutate: postLogin } = usePostLogin();

  const handleSubmit = methods.handleSubmit((data) => {
    return postLogin({
      email: data.email,
      password: data.password,
      accessIp: deviceInfo.accessIp,
      userAgent: deviceInfo.userAgent,
    });
  });

  return (
    <FormProvider {...methods}>
      <SignInInfo handleSubmit={handleSubmit} />
    </FormProvider>
  );
}
