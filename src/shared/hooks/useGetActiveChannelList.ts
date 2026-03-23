import { useQuery } from "@tanstack/react-query";

import { getActiveChannelList } from "@/shared/apis/getChannelList";
import {
  BrandCorporationBrandEnum,
  BrandCorporationCorporationEnum,
  ChannelResponse,
} from "@/shared/generated/oms/types/Channel";
import { useSingleBrandAndCorp } from "@/shared/hooks/useSingleBrandAndCorp";
import { queryKeys } from "@/shared/queryKeys";

export const useGetActiveChannelList = () => {
  const { brand, corporation } = useSingleBrandAndCorp();

  return useQuery<ChannelResponse[]>({
    queryKey: queryKeys.activeChannelList(brand, corporation),
    queryFn: () =>
      getActiveChannelList({
        brand: brand as BrandCorporationBrandEnum,
        corporation: corporation as BrandCorporationCorporationEnum,
      }) as Promise<ChannelResponse[]>,
    initialData: [],
    enabled: !!brand && !!corporation,
  });
};
