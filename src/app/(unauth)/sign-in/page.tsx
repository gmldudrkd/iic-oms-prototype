import { headers } from "next/headers";

import SignIn from "@/features/sign-in";
import { getClientIP } from "@/features/sign-in/models/api";
import { DeviceInfo } from "@/features/sign-in/models/types";

export default async function SignInPage() {
  // 서버사이드에서 디바이스 정보 가져오기
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const accessIp = await getClientIP();

  const deviceInfo: DeviceInfo = {
    userAgent,
    accessIp,
  };

  return <SignIn deviceInfo={deviceInfo} />;
}
