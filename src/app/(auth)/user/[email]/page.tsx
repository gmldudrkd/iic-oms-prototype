import PageClient from "@/app/(auth)/user/[email]/PageClient";

export function generateStaticParams() {
  return [{ email: "prototype@systemiic.com" }];
}

export default function Page() {
  return <PageClient />;
}
