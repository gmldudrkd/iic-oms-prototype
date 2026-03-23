import { useForm } from "react-hook-form";

import { LoginData, DeviceInfo } from "@/features/sign-in/models/types";

interface UseLoginFormProps {
  deviceInfo: DeviceInfo;
}

export default function useLoginForm({ deviceInfo }: UseLoginFormProps) {
  const methods = useForm<{ code: string } & LoginData>({
    defaultValues: {
      email: "",
      password: "",
      accessIp: deviceInfo.accessIp,
      userAgent: deviceInfo.userAgent,
      code: "",
    },
    mode: "onChange", // 실시간 유효성 검사
  });

  const { email, accessIp, userAgent, password, code } = methods.watch();

  const setEmail = (email: string) => {
    methods.setValue("email", email);
  };

  const setPassword = (password: string) => {
    methods.setValue("password", password);
  };

  return {
    methods,
    email,
    accessIp,
    userAgent,
    password,
    code,
    setEmail,
    setPassword,
  };
}
