import { useMutation } from "@tanstack/react-query";

import {
  postBulkCancelExchange,
  postBulkCancelOrder,
  postBulkCancelReturn,
} from "@/features/integrated-order-list/models/apis";

type GroupType = "order" | "return" | "exchange";

interface BulkCancelPayload {
  group: GroupType;
  ids: string[];
  reason?: string; // order만 필요
}

interface UsePostBulkCancelOptions {
  onSuccess?: () => void;
  onError?: (error: { errorMessage?: string } | unknown) => void;
}

export default function usePostBulkCancel(options?: UsePostBulkCancelOptions) {
  return useMutation({
    mutationFn: async ({ group, ids, reason }: BulkCancelPayload) => {
      if (group === "order")
        return postBulkCancelOrder({ orderIds: ids, reason: reason ?? "" });
      if (group === "return") return postBulkCancelReturn({ returnIds: ids });
      if (group === "exchange")
        return postBulkCancelExchange({ exchangeIds: ids });
      throw new Error("Invalid group value");
    },
    onSuccess: () => options?.onSuccess?.(),
    onError: (error) => options?.onError?.(error),
  });
}
