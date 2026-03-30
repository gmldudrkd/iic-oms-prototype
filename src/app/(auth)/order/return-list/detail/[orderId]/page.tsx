import PageClient from "@/app/(auth)/order/return-list/detail/[orderId]/PageClient";

export function generateStaticParams() {
  return [
    { orderId: "ord-20250201-001" },
    { orderId: "ord-20250201-002" },
    { orderId: "ord-20250201-003" },
    { orderId: "ord-20250201-004" },
    { orderId: "ord-20250201-005" },
    { orderId: "ord-20250201-006" },
    { orderId: "ord-20250201-007" },
    { orderId: "ord-20250201-008" },
  ];
}

export default function Page() {
  return <PageClient />;
}
