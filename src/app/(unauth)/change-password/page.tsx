import dynamic from "next/dynamic";

const ChangePassword = dynamic(() => import("@/features/change-password"), {
  ssr: false,
});

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
