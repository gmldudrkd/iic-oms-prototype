import { create } from "zustand";

interface MfaState {
  qrCodeUri: string | null;
  email: string;
  setQrCodeUri: (qrCodeUri: string | null) => void;
  setEmail: (email: string) => void;
  clearQrCodeUri: () => void;
  clearEmail: () => void;
}

/**
 * MFA 관련 상태를 관리하는 Zustand 스토어
 */
const useMfaStore = create<MfaState>((set) => ({
  qrCodeUri: null,
  email: "",
  setQrCodeUri: (qrCodeUri: string | null) => set({ qrCodeUri }),
  setEmail: (email: string) => set({ email }),
  clearQrCodeUri: () => set({ qrCodeUri: null }),
  clearEmail: () => set({ email: "" }),
}));

export default useMfaStore;
