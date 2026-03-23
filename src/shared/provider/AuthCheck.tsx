const dev =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_RUN_MODE !== "production";

const TIMEOUT = dev ? 12 * 60 * 60 * 1000 : 60 * 60 * 1000; // dev: 12시간, prod: 1시간
const _TEST_TIMEOUT = 10 * 1000; //  10초 테스트용

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  // Prototype: 인증 체크 비활성화
  return <>{children}</>;
}
