import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useUserPermissionData } from "@/features/header/hooks/useUserPermissionData";
import { useUserPermissionUI } from "@/features/header/hooks/useUserPermissionUI";
import { MULTI_PATHS } from "@/features/header/modules/constants";

import { useRouteStore } from "@/shared/stores/useRouteStore";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";

export const useUserPermission = () => {
  const pathname = usePathname();
  const { previousRoute } = useRouteStore();
  const { openSnackbar } = useSnackbarStore();
  const [isMultiple, setIsMultiple] = useState(true);

  const {
    options,
    selectedPermission,
    setSelectedPermission,
    allLabels,
    selectedLabels,
  } = useUserPermissionData();

  const {
    open,
    isShowError,
    localSelectedLabels,
    isAllSelected,
    setLocalSelectedLabels,
    handleChange,
    handleClose,
    handleOpen,
  } = useUserPermissionUI(
    options,
    allLabels,
    setSelectedPermission,
    isMultiple,
  );

  const selectedChannels = selectedPermission.flatMap((item) =>
    item.corporations?.flatMap((corp) =>
      corp.channels.map((channel) => channel.name),
    ),
  );

  const prevSelectedChannelsCountRef = useRef(selectedChannels.length);

  useEffect(() => {
    // "/" 경로도 멀티 경로에 포함
    const isMulti = MULTI_PATHS.some(
      (p) => pathname.includes(p) || pathname === "/",
    );
    setIsMultiple(isMulti);

    if (!isMulti && selectedPermission.length > 0) {
      const [first] = selectedPermission;
      const nextValue = [
        { brand: first.brand, corporations: [first.corporations[0]] },
      ];

      const willChange =
        JSON.stringify(selectedPermission) !== JSON.stringify(nextValue);

      if (willChange) {
        setSelectedPermission(nextValue);

        // selectedChannels가 여럿(2개 이상)에서 하나로 줄어드는 경우에만 스낵바 표시
        if (prevSelectedChannelsCountRef.current > 1) {
          openSnackbar({
            alertTitle: "Brand & Corp Value Changed",
            message:
              "In the Stock and Product menus, \nyou can select only one brand.",
            severity: "warning",
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, previousRoute, openSnackbar]);

  // selectedChannels 길이 변경 시 ref 업데이트
  useEffect(() => {
    prevSelectedChannelsCountRef.current = selectedChannels.length;
  }, [selectedChannels.length]);

  useEffect(() => {
    setLocalSelectedLabels(selectedLabels);
  }, [selectedLabels, setLocalSelectedLabels]);

  return {
    allLabels,
    selectedLabels: localSelectedLabels,
    options,
    isShowError,
    open,
    isAllSelected,
    isMultiple,
    handleChange,
    handleClose,
    handleOpen,
  };
};
