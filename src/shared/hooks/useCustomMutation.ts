import { useMutation } from "@tanstack/react-query";

import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { ApiError } from "@/shared/types";

const isPrototype = process.env.NEXT_PUBLIC_PROTOTYPE_MODE === "true";

/**
 * useCustomMutation 훅의 props 인터페이스
 * @template TData - mutation 함수에 전달될 데이터의 타입
 * @template TResult - mutation 결과 데이터의 타입
 */
interface UseCustomMutationProps<TData, TResult> {
  /** API 호출을 수행하는 mutation 함수 */
  mutationFn: (data: TData) => Promise<TResult>;
  /** mutation 성공 시 기본 onSuccess 실행 전에 실행될 콜백 함수 (선택사항) */
  preOnSuccess?: (response: TResult) => { proceed: boolean };
  /** mutation 성공 시 실행될 콜백 함수 (선택사항) */
  onSuccess?: (response: TResult) => void;
  /** mutation 실패 시 실행될 콜백 함수 (선택사항) */
  onError?: (error: ApiError) => void;
}

/**
 * 전역 스낵바와 통합된 커스텀 mutation 훅
 *
 * 이 훅은 TanStack Query의 useMutation을 래핑하여 다음과 같은 기능을 제공합니다:
 * - 자동 에러 처리 및 스낵바 표시
 * - 성공/실패 상태에 따른 일관된 사용자 피드백
 * - 타입 안전성 보장
 *
 * @template TData - mutation 함수에 전달될 데이터의 타입
 * @template TResult - mutation 결과 데이터의 타입
 * @param props - mutation 설정 옵션 (UseCustomMutationProps 타입)
 * @returns TanStack Query의 useMutation 결과와 동일한 객체
 *
 * @example
 * ```typescript
 * const mutation = useCustomMutation({
 *   mutationFn: (data: CreateUserData) => createUserAPI(data),
 *   onSuccess: (response) => {
 *     console.log('사용자 생성 성공:', response.data);
 *   }
 * });
 *
 * // 사용
 * mutation.mutate(userData);
 * ```
 */
export default function useCustomMutation<TData, TResult>({
  mutationFn,
  preOnSuccess,
  onSuccess,
  onError,
}: UseCustomMutationProps<TData, TResult>) {
  const { openSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: isPrototype
      ? async (data: TData) => {
          console.log("[PROTOTYPE] mutation 호출됨 (no-op):", data);
          return {} as TResult;
        }
      : mutationFn,
    onSuccess: (response: TResult) => {
      if (isPrototype) {
        console.log("[PROTOTYPE] mutation 성공 (no-op)");
        return;
      }

      // onSuccess 콜백 실행 이전에 전처리가 필요한 경우
      if (preOnSuccess) {
        const { proceed } = preOnSuccess(response);

        if (!proceed) {
          return;
        }
      }

      // 사용자 정의 onSuccess 콜백 실행
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (error: ApiError) => {
      if (isPrototype) {
        console.log("[PROTOTYPE] mutation 에러 무시됨");
        return;
      }

      // 에러 로그 출력
      console.error(error);

      // 사용자 정의 onError 콜백 실행
      if (onError) {
        return onError(error);
      }

      // 기본 에러 메시지를 스낵바로 표시
      openSnackbar({
        message: error.errorMessage || "서버 오류가 발생했습니다.",
        severity: "error",
      });
    },
  });
}
