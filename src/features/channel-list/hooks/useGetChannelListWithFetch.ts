import { useQuery } from "@tanstack/react-query";

import { getChannelListWithFetch } from "@/features/channel-list/models/apis";

import { queryKeys } from "@/shared/queryKeys";

export const useGetChannelListWithFetch = () => {
  return useQuery({
    queryKey: queryKeys.channelList(),
    queryFn: () => getChannelListWithFetch(),
  });
};
