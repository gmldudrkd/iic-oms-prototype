import {
  MOCK_PROMOTIONS,
  reservedPromotionIds,
} from "@/features/promotion-list/modules/mockData";

import PageClient from "@/app/(auth)/promotion/promotion-list/edit-v2/[promotionId]/PageClient";

// 신규 등록 후 상세 진입용 예약 ID 도 정적 페이지로 함께 생성한다
export function generateStaticParams() {
  return [
    ...MOCK_PROMOTIONS.map((row) => row.id),
    ...reservedPromotionIds(),
  ].map((id) => ({ promotionId: String(id) }));
}

export default function Page() {
  return <PageClient />;
}
