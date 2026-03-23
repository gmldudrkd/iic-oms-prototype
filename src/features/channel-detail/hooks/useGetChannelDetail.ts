import { useQuery } from "@tanstack/react-query";

import { getChannelDetail } from "@/features/channel-detail/models/apis";

import { queryKeys } from "@/shared/queryKeys";

export const useGetChannelDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.channelDetail(id),
    queryFn: () => getChannelDetail(id),
    enabled: !!id,
  });
};
