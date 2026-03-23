"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import VerifyCode from "@/features/sign-in/components/VerifyCode";
import useActivateMfa from "@/features/sign-in/hooks/useActivateMfa";
import usePostVerifyCode from "@/features/sign-in/hooks/usePostVerifyCode";

import useMfaStore from "@/shared/stores/useMfaStore";

export default function VerifyCodePage() {
  const router = useRouter();
  const { qrCodeUri, email, clearQrCodeUri } = useMfaStore();

  const methods = useForm<{ code: string }>({
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const { mutate: postActivateMfa } = useActivateMfa();
  const { mutate: postVerifyMfaCode } = usePostVerifyCode({
    email,
  });

  useEffect(() => {
    const mfaToken = window.sessionStorage.getItem("mfaToken");

    if (!mfaToken) {
      // mfaToken이 없으면 로그인 페이지로 리다이렉트
      router.push("/sign-in");
      return;
    }
  }, [router]);

  const handleSubmit = methods.handleSubmit((data) => {
    const mfaToken = window.sessionStorage.getItem("mfaToken");

    if (!mfaToken) {
      router.push("/sign-in");
      return;
    }

    if (qrCodeUri) {
      // mfa 활성화 단계
      return postActivateMfa(
        {
          token: mfaToken,
          data: {
            code: data.code,
          },
        },
        {
          onSuccess: () => {
            // 활성화 성공 후 qrCodeUri 제거
            clearQrCodeUri();
            methods.reset();
          },
        },
      );
    }

    // mfa 활성화 이후 코드 인증 단계
    return postVerifyMfaCode({
      token: mfaToken,
      data: {
        code: data.code,
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <VerifyCode qrCodeUri={qrCodeUri} handleSubmit={handleSubmit} />
    </FormProvider>
  );
}
