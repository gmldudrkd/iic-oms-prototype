import { FetchWithoutAuth } from "@/shared/apis/fetchExtended";
import { UserCreateRequest } from "@/shared/generated/auth/types/Auth";

export const postSignup = (data: UserCreateRequest) =>
  FetchWithoutAuth(`/auth/signup`, "POST", data)
    .then((res) => res)
    .catch((error) => {
      console.error("postRequestAccount API 에러:", error);
      throw error;
    }) as Promise<void>;
