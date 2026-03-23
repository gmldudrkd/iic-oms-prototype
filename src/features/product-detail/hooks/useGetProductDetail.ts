import { useQuery } from "@tanstack/react-query";

import { getProductDetail } from "@/features/product-detail/models/apis";
import { transformProductDetail } from "@/features/product-detail/models/transforms";

import { queryKeys } from "@/shared/queryKeys";
import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

// 📍 상품 상세 조회 API 호출
export default function useGetProductDetail(sku: string) {
  const { timezone } = useTimezoneStore();

  return useQuery({
    queryKey: queryKeys.productDetail(sku),
    queryFn: () => getProductDetail(sku),
    select: (data) => transformProductDetail(data, timezone),
  });
}
