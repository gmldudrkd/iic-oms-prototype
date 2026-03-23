import { ChannelResponse } from "@/shared/generated/oms/types/Channel";
import { BrandResponse } from "@/shared/generated/oms/types/User";
import { OnlineStoreResponse } from "@/shared/generated/sap/types/MasterStore";
import { getLocalTime } from "@/shared/utils/formatDate";

export const transformChannelData = (
  data: ChannelResponse[],
  timezone: string,
  selectedPermission: BrandResponse[],
) => {
  return data
    .filter((item) => {
      // 같은 brand를 가진 모든 permission 찾기
      const matchedPermissions = selectedPermission.filter(
        (permission) => item.brand.name === permission.brand.name,
      );

      if (matchedPermissions.length === 0) return false;

      // 모든 매칭된 permission의 corporations를 합침
      const selectedCorpNames = new Set(
        matchedPermissions.flatMap((permission) =>
          permission.corporations.map((corp) => corp.name),
        ),
      );

      // item의 corporation이 선택된 corporations에 포함되는지 확인
      return selectedCorpNames.has(item.corporation);
    })
    .map((item) => {
      return {
        id: item.channelId,
        brand: item.brand.description,
        corp: item.corporation,
        channelName: item.channelName,
        channelType: item.channelType,
        sapChannelCode: item.sapChannelCode,
        sapChannelName: item.sapChannelName,
        isActive: item.isActive ? "Yes" : "No",
        createdAt: getLocalTime(item.createdAt, timezone),
        updatedAt: getLocalTime(item.updatedAt, timezone),
      };
    });
};

export const transformSAPChannelData = (
  data: OnlineStoreResponse[],
  selectedPermission: BrandResponse[],
): { code: string; name: string; brand: string }[] => {
  if (!data) return [];

  const filtered = data
    .map((item) => {
      // 같은 brand를 가진 permission 찾기
      const matchedPermissions = selectedPermission.filter(
        (p) => item.brand === p.brand.name,
      );

      if (matchedPermissions.length === 0) return null;

      // 브랜드에 해당하는 모든 corporation 모음
      const selectedCorpNames = new Set(
        matchedPermissions.flatMap((permission) =>
          permission.corporations.map((corp) => corp.name),
        ),
      );

      // undefined safety 추가
      const corporations = item.corporations ?? [];

      const filteredCorporations = corporations.filter((corp) =>
        selectedCorpNames.has(corp.corporation ?? ""),
      );

      if (filteredCorporations.length === 0) return null;

      return {
        ...item,
        corporations: filteredCorporations,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return filtered.flatMap((item) =>
    item.corporations.flatMap((c) =>
      (c.onlineStores ?? [])
        .filter((s) => s.code && s.name)
        .map((s) => ({
          code: s.code!,
          name: s.name!,
          brand: item.brand!,
        })),
    ),
  );
};
