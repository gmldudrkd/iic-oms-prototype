import { useQuery } from "@tanstack/react-query";

import { getChannelStockSetting } from "@/features/stock/distributionSetting/models/apis";
import {
  toBrandEnum,
  toCorpEnum,
} from "@/features/stock/distributionSetting/models/types";

import { queryKeys } from "@/shared/queryKeys";
import { convertToArray } from "@/shared/utils/stringUtils";

interface Props {
  brand: string;
  corporation: string;
  searchKeyType: string;
  searchKeyword: string | undefined;
}

export default function useGetChannelStockSetting(params: Props) {
  const brandEnum = toBrandEnum(params.brand);
  const corporationEnum = toCorpEnum(params.corporation);

  const { searchKeyType } = params;
  const searchKeyword = convertToArray(params.searchKeyword ?? "");

  return useQuery({
    queryKey: queryKeys.channelStockSetting(
      brandEnum,
      corporationEnum,
      searchKeyType,
      JSON.stringify(searchKeyword),
    ),
    queryFn: () =>
      getChannelStockSetting({
        brand: brandEnum,
        corporation: corporationEnum,
        [searchKeyType]: searchKeyword,
      }),
    enabled: !!brandEnum && !!corporationEnum && searchKeyword.length > 0,
    initialData: [],
  });
}
