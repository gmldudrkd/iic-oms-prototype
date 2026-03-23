import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface OrderNoStore {
  orderInfo: {
    orderNo: string;
    isGifted: boolean;
  };
  setOrderInfo: (orderInfo: { orderNo: string; isGifted: boolean }) => void;
}

export const useOrderNoStore = create<OrderNoStore>()(
  devtools(
    (set) => ({
      orderInfo: {
        orderNo: "",
        isGifted: false,
      },
      setOrderInfo: (orderInfo: { orderNo: string; isGifted: boolean }) =>
        set({ orderInfo }),
    }),
    { name: "📡 OrderNoStore" },
  ),
);
