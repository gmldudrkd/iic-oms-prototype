import { getSession } from "next-auth/react";

const isDevelopment =
  process.env.NEXT_PUBLIC_RUN_MODE === "development" ||
  process.env.NEXT_PUBLIC_RUN_MODE === "local" ||
  process.env.NODE_ENV === "development";

export const updateNextAuthSession = async (newTokenData: {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
  user?: unknown;
}) => {
  try {
    // next-auth/react의 update 함수를 동적으로 import하여 사용
    const nextAuthModule = await import("next-auth/react");

    // update 함수가 존재하는지 확인 후 사용
    if (
      "update" in nextAuthModule &&
      typeof nextAuthModule.update === "function"
    ) {
      await nextAuthModule.update(newTokenData);
      if (isDevelopment) {
        console.log("✅ [updateNextAuthSession] NextAuth 세션 업데이트 완료");
      }
    } else {
      // update 함수가 없는 경우 getSession을 다시 호출하여 캐시 갱신
      await getSession();
      if (isDevelopment) {
        console.log("✅ [updateNextAuthSession] 세션 캐시 강제 갱신 완료");
      }
    }
  } catch (error) {
    if (isDevelopment) {
      console.warn("⚠️ [updateNextAuthSession] 세션 갱신 실패:", error);
    }
    // fallback: getSession 재호출
    try {
      await getSession();
    } catch (fallbackError) {
      if (isDevelopment) {
        console.error(
          "⚠️ [updateNextAuthSession] fallback도 실패:",
          fallbackError,
        );
      }
    }
  }
};
