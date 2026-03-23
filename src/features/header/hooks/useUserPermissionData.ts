import { isEqual } from "lodash";
import { useEffect, useMemo, useRef, useCallback } from "react";

import useGetUserPermission from "@/features/header/hooks/useGetUserPermission";
import { STORAGE_KEYS } from "@/features/header/modules/constants";

import { BrandResponse } from "@/shared/generated/oms/types/User";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

export const useUserPermissionData = () => {
  const { data } = useGetUserPermission();
  const { selectedPermission, setSelectedPermission } =
    useUserPermissionStore();

  const options = useMemo(() => data?.brands ?? [], [data?.brands]);
  const isInitializedRef = useRef(false);

  /** 초기화 (로컬스토리지 기반) */
  useEffect(() => {
    if (!options.length || isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PERMISSION);
      const parsed = saved ? JSON.parse(saved) : [];
      const initialValue = parsed.length > 0 ? parsed : options;

      if (!isEqual(selectedPermission, initialValue)) {
        setSelectedPermission(initialValue);
      }
    } catch {
      if (!isEqual(selectedPermission, options)) {
        setSelectedPermission(options);
      }
    }
  }, [options, selectedPermission, setSelectedPermission]);

  /** label 생성 유틸 */
  const makeLabels = useCallback(
    (item: BrandResponse) =>
      item?.corporations?.map(
        (corp) => `${item.brand?.description} ${corp.name}`,
      ) ?? [],
    [],
  );

  const allLabels = useMemo(
    () => options.flatMap(makeLabels),
    [options, makeLabels],
  );
  const selectedLabels = useMemo(
    () => selectedPermission.flatMap(makeLabels),
    [selectedPermission, makeLabels],
  );

  return {
    options,
    selectedPermission,
    setSelectedPermission,
    allLabels,
    selectedLabels,
  };
};
