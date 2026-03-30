import SignIn from "@/features/sign-in";
import { getClientIP } from "@/features/sign-in/models/api";
import { DeviceInfo } from "@/features/sign-in/models/types";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

export default async function SignInPage() {
  if (isPrototype) {
    const deviceInfo: DeviceInfo = {
      userAgent: "prototype",
      accessIp: "127.0.0.1",
    };
    return <SignIn deviceInfo={deviceInfo} />;
  }

  // 서버사이드에서 디바이스 정보 가져오기
  const { headers } = await import("next/headers");
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const accessIp = await getClientIP();

  const deviceInfo: DeviceInfo = {
    userAgent,
    accessIp,
  };

  return <SignIn deviceInfo={deviceInfo} />;
}
