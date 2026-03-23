import { SelectChangeEvent } from "@mui/material";
import { useState, useCallback } from "react";

import { ALL_OPTION_VALUE } from "@/features/header/modules/constants";

import { BrandResponse } from "@/shared/generated/oms/types/User";

/**
 * UI 상태 제어용 훅
 * - 다중/단일 선택 로직을 분리해서 최신 state 반영 문제 해결
 */
export const useUserPermissionUI = (
  options: BrandResponse[],
  allLabels: string[],
  setSelectedPermission: (p: BrandResponse[]) => void,
  isMultiple: boolean,
) => {
  const [open, setOpen] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [localSelectedLabels, setLocalSelectedLabels] = useState<string[]>([]);

  /** ---------------------------
   * ✅ 다중 선택 핸들러
   * --------------------------- */
  const handleChangeMultiple = useCallback(
    (valueLabels: string[]) => {
      if (valueLabels.at(-1) === ALL_OPTION_VALUE) {
        setLocalSelectedLabels(
          localSelectedLabels.length === allLabels.length ? [] : allLabels,
        );
        return;
      }
      setLocalSelectedLabels(valueLabels);
    },
    [allLabels, localSelectedLabels.length],
  );

  /** ---------------------------
   * ✅ 단일 선택 핸들러 (즉시 반영)
   * --------------------------- */
  const handleChangeSingle = useCallback(
    (valueLabels: string[]) => {
      const selectedLabel = Array.isArray(valueLabels)
        ? valueLabels[0]
        : (valueLabels as string);

      const nextLabels = [selectedLabel];
      setLocalSelectedLabels(nextLabels);

      const matchedObjects = options
        .map((brandItem) => {
          const matchedCorporations =
            brandItem.corporations?.filter((corp) =>
              nextLabels.includes(
                `${brandItem.brand.description} ${corp.name}`,
              ),
            ) ?? [];
          return matchedCorporations.length
            ? { ...brandItem, corporations: matchedCorporations }
            : null;
        })
        .filter(Boolean) as BrandResponse[];

      setSelectedPermission(matchedObjects);
    },
    [options, setSelectedPermission],
  );

  /** ---------------------------
   * ✅ 공통 Select 핸들러
   * --------------------------- */
  const handleChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const valueLabels = event.target.value as string[];
      if (isMultiple) handleChangeMultiple(valueLabels);
      else handleChangeSingle(valueLabels);
      if (isShowError) setIsShowError(false);
    },
    [handleChangeMultiple, handleChangeSingle, isShowError, isMultiple],
  );

  /** ---------------------------
   * ✅ 닫힐 때 (멀티 전용)
   * --------------------------- */
  const handleCloseMultiple = useCallback(
    (event: React.SyntheticEvent) => {
      if (localSelectedLabels.length === 0) {
        setIsShowError(true);
        setOpen(true);
        event.preventDefault();
        return;
      }

      const matchedObjects = options
        .map((brandItem) => {
          const matchedCorporations =
            brandItem.corporations?.filter((corp) =>
              localSelectedLabels.includes(
                `${brandItem.brand.description} ${corp.name}`,
              ),
            ) ?? [];
          return matchedCorporations.length
            ? { ...brandItem, corporations: matchedCorporations }
            : null;
        })
        .filter(Boolean) as BrandResponse[];

      setSelectedPermission(matchedObjects);
      setOpen(false);
    },
    [localSelectedLabels, options, setSelectedPermission],
  );

  const handleCloseSingle = useCallback(() => {
    setOpen(false);
  }, []);

  /** ---------------------------
   * ✅ 공통 Close 핸들러
   * --------------------------- */
  const handleClose = useCallback(
    (event: React.SyntheticEvent) => {
      if (isMultiple) handleCloseMultiple(event);
      else handleCloseSingle();
    },
    [handleCloseMultiple, handleCloseSingle, isMultiple],
  );

  const handleOpen = () => setOpen(true);

  return {
    /** 상태 */
    open,
    isShowError,
    localSelectedLabels,
    isAllSelected: localSelectedLabels.length === allLabels.length,
    setLocalSelectedLabels,

    /** 핸들러 */
    handleChange,
    handleClose,
    handleOpen,
  };
};
