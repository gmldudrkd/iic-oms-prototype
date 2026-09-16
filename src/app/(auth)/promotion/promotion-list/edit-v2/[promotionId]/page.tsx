import PageClient from "@/app/(auth)/promotion/promotion-list/edit-v2/[promotionId]/PageClient";

import { MOCK_PROMOTIONS } from "@/features/promotion-list/modules/mockData";

export function generateStaticParams() {
  return MOCK_PROMOTIONS.map((row) => ({ promotionId: String(row.id) }));
}

export default function Page() {
  return <PageClient />;
}
