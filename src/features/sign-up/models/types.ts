import {
  UserCreateRequest,
  UserCreateRequestRoleEnum,
} from "@/shared/generated/auth/types/Auth";

export interface ExtendedUserCreateRequest
  extends Omit<UserCreateRequest, "role"> {
  role: UserCreateRequestRoleEnum | null;
}
