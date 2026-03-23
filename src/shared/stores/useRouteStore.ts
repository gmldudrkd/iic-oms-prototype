import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RouteHistoryState {
  previousRoute: string | null;
  currentRoute: string | null;
  updateRoute: (next: string) => void;
}

export const useRouteStore = create<RouteHistoryState>()(
  devtools(
    (set, get) => ({
      previousRoute: null,
      currentRoute: null,
      updateRoute: (next) => {
        const { currentRoute } = get();
        if (currentRoute === next) return;
        set(
          { previousRoute: currentRoute, currentRoute: next },
          false,
          "updateRoute",
        );
      },
    }),
    { name: "🧭 RouteStore" },
  ),
);
