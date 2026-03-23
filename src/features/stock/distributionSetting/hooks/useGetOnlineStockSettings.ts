import { useQuery } from "@tanstack/react-query";

import { getOnlineStockSettings } from "@/features/stock/distributionSetting/models/apis";

import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";
import { queryKeys } from "@/shared/queryKeys";

export default function useGetOnlineStockSettings() {
  const { brand, corporation } = useSingleBrandAndCorp();

  return useQuery({
    queryKey: queryKeys.onlineStockSettings(brand, corporation),
    queryFn: () => getOnlineStockSettings(brand, corporation),
    enabled: !!brand && !!corporation,
  });
}
