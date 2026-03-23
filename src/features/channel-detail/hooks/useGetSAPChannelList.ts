import { useQuery } from "@tanstack/react-query";

import { getSAPChannelList } from "@/features/channel-detail/models/apis";

import { BrandResponse } from "@/shared/generated/oms/types/User";
import { queryKeys } from "@/shared/queryKeys";
import { createQueryParams } from "@/shared/utils/querystring";

export const useGetSAPChannelList = (
  userPermission: BrandResponse[] | undefined,
) => {
  const brands = userPermission
    ? Array.from(
        new Set(userPermission.map((item) => item.brand.name).filter(Boolean)),
      )
    : [];

  const corps = userPermission
    ? Array.from(
        new Set(
          userPermission.flatMap((item) =>
            item.corporations.map((corp) => corp.name).filter(Boolean),
          ),
        ),
      )
    : [];

  const queryParams = createQueryParams({
    brands: brands.length > 0 ? brands.join(",") : undefined,
    corporations: corps.length > 0 ? corps.join(",") : undefined,
  });

  return useQuery({
    queryKey: queryKeys.sapChannelList(queryParams),
    queryFn: () => getSAPChannelList(queryParams),
    enabled: !!userPermission && userPermission.length > 0,
  });
};
