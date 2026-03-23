import { NextRequest, NextResponse } from "next/server";
import NextAuth, {
  AuthOptions,
  DefaultSession,
  Session,
  User,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Prototype mode: mock session for /api/auth/session
const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";
const MOCK_SESSION_RESPONSE = {
  user: {
    id: "prototype@systemiic.com",
    userId: "prototype@systemiic.com",
    lastLoginAt: new Date().toISOString(),
  },
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  accessToken: "prototype-mock-access-token",
  refreshToken: "prototype-mock-refresh-token",
  accessTokenExpires: Date.now() + 365 * 24 * 60 * 60 * 1000,
  refreshTokenExpires: Date.now() + 365 * 24 * 60 * 60 * 1000,
};

interface CustomUser extends User {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
  lastLoginAt: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    error?: string;
    user: {
      id: string;
      userId?: string;
      lastLoginAt?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    error?: string;
  }
}

const TEST_TOKEN_EXPIRES_TIME = Date.now() + 60000;
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "email-credentials",
      name: "Email Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        lastLoginAt: { label: "Last Login Time", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        accessTokenExpires: { label: "Access Token Expire", type: "text" },
        refreshTokenExpires: { label: "Refresh Token Expire", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        console.log("🔍 [authorize] 백엔드에서 받은 값:", credentials);

        if (!credentials?.accessToken || !credentials?.refreshToken) {
          throw new Error("잘못된 로그인 정보");
        }

        // API에서 이미 밀리초 단위로 전달되는 만료 시간을 그대로 사용
        // const accessTokenExpiresIn = Number(credentials.accessTokenExpires);
        // const refreshTokenExpiresIn = Number(credentials.refreshTokenExpires);

        // 현재 시간에 만료 시간을 더해서 절대 시간 계산
        const now = Date.now();
        // const accessTokenExpiresAt = TEST_TOKEN_EXPIRES_TIME;
        const accessTokenExpiresAt = Number(credentials.accessTokenExpires);
        const refreshTokenExpiresAt = Number(credentials.refreshTokenExpires);

        console.log("⏰ 토큰 만료 시간 계산:", {
          now,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
          "인증 토큰 만료 시간": new Date(accessTokenExpiresAt).toLocaleString(
            "ko-KR",
            {
              timeZone: "Asia/Seoul",
            },
          ),
          "리프레시 토큰 만료 시간": new Date(
            refreshTokenExpiresAt,
          ).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          }),
        });

        return {
          id: credentials.userId,
          lastLoginAt: credentials.lastLoginAt,
          userId: credentials.userId,
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          accessTokenExpires: accessTokenExpiresAt,
          refreshTokenExpires: refreshTokenExpiresAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user?: CustomUser | User | AdapterUser;
      trigger?: "signIn" | "signUp" | "update";
    }): Promise<JWT> {
      console.log("🔄 [jwt] 실행됨 → 트리거:", trigger);

      // 최초 로그인 시
      if (user && trigger === "signIn") {
        console.log("🔑 [jwt] 최초 로그인 시 토큰 정보:", {
          accessToken: (user as CustomUser).accessToken,
          refreshToken: (user as CustomUser).refreshToken,
          accessTokenExpires: (user as CustomUser).accessTokenExpires,
          refreshTokenExpires: (user as CustomUser).refreshTokenExpires,
          lastLoginAt: (user as CustomUser).lastLoginAt,
          userId: (user as CustomUser).userId,
        });
        return {
          ...token,
          accessToken: (user as CustomUser).accessToken,
          refreshToken: (user as CustomUser).refreshToken,
          accessTokenExpires: (user as CustomUser).accessTokenExpires,
          refreshTokenExpires: (user as CustomUser).refreshTokenExpires,
          lastLoginAt: (user as CustomUser).lastLoginAt,
          userId: (user as CustomUser).userId,
        };
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.refreshTokenExpires = token.refreshTokenExpires;

      session.user = {
        ...session.user,
        id: token.userId as string,
        lastLoginAt: token.lastLoginAt as string,
      };
      // 토큰 오류 상태를 세션에 전달
      if (token.error) {
        // @ts-ignore - 에러는 타입에 정의되어 있지 않지만 사용해야 함
        session.error = token.error;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

// Prototype mode: intercept session requests to return mock session
const prototypeHandler = async (req: NextRequest) => {
  const url = new URL(req.url);
  if (isPrototype && url.pathname.endsWith("/session")) {
    return NextResponse.json(MOCK_SESSION_RESPONSE);
  }
  // CSRF token도 mock으로 반환
  if (isPrototype && url.pathname.endsWith("/csrf")) {
    return NextResponse.json({ csrfToken: "prototype-csrf-token" });
  }
  return handler(req as any, { params: { nextauth: url.pathname.split("/api/auth/")[1]?.split("/") || [] } } as any);
};

export const GET = isPrototype ? prototypeHandler : handler;
export const POST = isPrototype ? prototypeHandler : handler;
