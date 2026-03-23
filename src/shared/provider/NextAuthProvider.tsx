"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import AuthCheck from "@/shared/provider/AuthCheck";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

const MOCK_SESSION = {
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  user: {
    id: "prototype@systemiic.com",
    userId: "prototype@systemiic.com",
    lastLoginAt: new Date().toISOString(),
  },
  accessToken: "prototype-mock-access-token",
  refreshToken: "prototype-mock-refresh-token",
  accessTokenExpires: Date.now() + 365 * 24 * 60 * 60 * 1000,
  refreshTokenExpires: Date.now() + 365 * 24 * 60 * 60 * 1000,
};

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (isPrototype) {
    return (
      <SessionProvider session={MOCK_SESSION as never} refetchInterval={0}>
        {children}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider refetchInterval={60 * 5} refetchOnWindowFocus>
      <AuthCheck>{children}</AuthCheck>
    </SessionProvider>
  );
}
