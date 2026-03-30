import PageClient from "@/app/(auth)/channel/channel-list/detail/[id]/PageClient";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default function Page() {
  return <PageClient />;
}
