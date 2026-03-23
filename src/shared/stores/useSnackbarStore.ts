import { create } from "zustand";

import type { AlertColor } from "@mui/material";

/**
 * Snackbar 관련 타입 정의
 */

// Snackbar의 상태를 정의하는 인터페이스
interface SnackbarState {
  /** Snackbar의 표시 여부 */
  isOpen: boolean;
  /** Snackbar에 표시될 메시지 */
  message: string | React.ReactNode;
  /** Snackbar의 종류 (success, error, warning, info) */
  severity: AlertColor;
  /** Snackbar가 자동으로 닫히는 시간 (ms), null일 경우 자동으로 닫히지 않음 */
  autoHideDuration: number | null;
  /** Snackbar의 제목 (옵션) */
  alertTitle: string;
  /** Snackbar의 닫기 버튼 (옵션) */
  closeButton?: React.ReactNode;
  /** Snackbar variants (filled, outlined, standard) */
  alertVariant?: "filled" | "outlined" | "standard";
}

// Snackbar를 열 때 필요한 파라미터 인터페이스
interface OpenSnackbarParams {
  /** 표시할 메시지 내용 */
  message: string | React.ReactNode;
  /** 메시지의 종류 (success, error, warning, info) */
  severity: AlertColor;
  /** 알림의 제목 (선택사항) */
  alertTitle?: string;
  /** 자동으로 닫히는 시간 (ms), null이면 자동으로 닫히지 않음 (선택사항) */
  autoHideDuration?: number | null;
  /** 닫기 버튼 (선택사항) */
  closeButton?: React.ReactNode;
  /** Snackbar variants (filled, outlined, standard) */
  alertVariant?: "filled" | "outlined" | "standard";
}

// Snackbar의 액션(함수)들을 정의하는 인터페이스
interface SnackbarActions {
  /** Snackbar를 여는 함수 */
  openSnackbar: (params: OpenSnackbarParams) => void;
  /** Snackbar를 닫는 함수 */
  closeSnackbar: () => void;
}

// 전체 Snackbar 스토어 타입 (상태 + 액션)
type SnackbarStore = SnackbarState & SnackbarActions;

/**
 * 상수 정의
 */
const SNACKBAR_CONSTANTS = {
  /** 기본 자동 닫힘 시간 (3초) */
  DEFAULT_AUTO_HIDE_DURATION: 3000,
  /** 기본 메시지 타입 */
  DEFAULT_SEVERITY: "success" as AlertColor,
} as const;

/**
 * Zustand 스토어 생성
 * 전역적으로 사용할 수 있는 Snackbar 상태와 액션을 관리
 */
const useSnackbarStore = create<SnackbarStore>((set) => ({
  // 초기 상태 값
  isOpen: false,
  message: "",
  severity: SNACKBAR_CONSTANTS.DEFAULT_SEVERITY,
  autoHideDuration: SNACKBAR_CONSTANTS.DEFAULT_AUTO_HIDE_DURATION,
  alertTitle: "",
  closeButton: undefined,
  alertVariant: "standard",
  // 액션 메서드
  openSnackbar: ({
    message,
    severity,
    alertTitle = "",
    autoHideDuration = SNACKBAR_CONSTANTS.DEFAULT_AUTO_HIDE_DURATION,
    closeButton,
    alertVariant,
  }: OpenSnackbarParams) => {
    set({
      isOpen: true,
      message,
      severity,
      alertTitle,
      autoHideDuration,
      closeButton,
      alertVariant,
    });
  },

  closeSnackbar: () => {
    set({ isOpen: false });
  },
}));

export default useSnackbarStore;
