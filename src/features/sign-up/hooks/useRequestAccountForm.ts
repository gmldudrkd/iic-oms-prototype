import { useForm } from "react-hook-form";

import { ExtendedUserCreateRequest } from "@/features/sign-up/models/types";

import {
  UserCreateRequestPermissionBrandEnum,
  UserCreateRequestPermissionCorporationsEnum,
} from "@/shared/generated/auth/types/Auth";

export default function useRequestAccountForm() {
  const methods = useForm<ExtendedUserCreateRequest>({
    defaultValues: {
      email: "",
      password: "",
      reason: "",
      role: null,
      permissions: [],
    },
    mode: "onChange",
  });

  // permissions 유효성 검사를 위한 register
  methods.register("permissions", {
    validate: (permissions) => {
      if (!permissions || permissions.length === 0) {
        return "Please select a brand-corp.";
      }
      return true;
    },
  });

  const handleSelectBrands = (
    brand: UserCreateRequestPermissionBrandEnum,
    corporation: UserCreateRequestPermissionCorporationsEnum,
    checked: boolean,
  ) => {
    const currentPermissions = methods.watch("permissions") || [];

    if (checked) {
      // 체크된 경우: 해당 브랜드가 이미 있는지 확인
      const existingPermissionIndex = currentPermissions.findIndex(
        (p) => p.brand === brand,
      );

      if (existingPermissionIndex >= 0) {
        // 브랜드가 이미 있으면 법인 추가
        const updatedPermissions = [...currentPermissions];
        updatedPermissions[existingPermissionIndex] = {
          ...updatedPermissions[existingPermissionIndex],
          corporations: [
            ...updatedPermissions[existingPermissionIndex].corporations,
            corporation,
          ],
        };
        methods.setValue("permissions", updatedPermissions, {
          shouldValidate: true,
        });
      } else {
        // 브랜드가 없으면 새로 추가
        methods.setValue(
          "permissions",
          [...currentPermissions, { brand, corporations: [corporation] }],
          { shouldValidate: true },
        );
      }
    } else {
      // 체크 해제된 경우: 해당 법인 제거
      const updatedPermissions = currentPermissions
        .map((permission) => ({
          ...permission,
          corporations:
            permission.brand === brand
              ? permission.corporations.filter((corp) => corp !== corporation)
              : permission.corporations,
        }))
        .filter((permission) => permission.corporations.length > 0); // 법인이 없는 브랜드 제거

      methods.setValue("permissions", updatedPermissions, {
        shouldValidate: true,
      });
    }
  };

  // 특정 브랜드의 특정 법인이 선택되어 있는지 확인하는 헬퍼 함수
  const isSelected = (
    brand: UserCreateRequestPermissionBrandEnum,
    corporation: UserCreateRequestPermissionCorporationsEnum,
  ): boolean => {
    const permissions = methods.watch("permissions") || [];
    const brandPermission = permissions.find((p) => p.brand === brand);
    return brandPermission
      ? brandPermission.corporations.includes(corporation)
      : false;
  };

  return {
    methods,
    handleSelectBrands,
    isSelected,
  };
}
