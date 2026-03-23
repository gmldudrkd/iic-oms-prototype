import { GridPaginationModel } from "@mui/x-data-grid-pro";
import { SetStateAction } from "react";
import { Dispatch } from "react";

interface PIMPaginationParams {
  pageNo: number;
  pageSize: number;
  direction?: string;
  firstSku?: string;
  lastSku?: string;
}

interface PIMPaginationData {
  pagination: {
    nextCursor?: string;
    previousCursor?: string;
  };
}

interface PIMPaginationProps<P, D> {
  params: P;
  setParams: Dispatch<SetStateAction<P>>;
  data?: D;
}

// PIM 페이지네이션
export const usePIMPagination = <P extends PIMPaginationParams, D extends PIMPaginationData>({ params, setParams, data }: PIMPaginationProps<P, D>) => {
  const handlePaginationChange = ({ page, pageSize }: GridPaginationModel) => {
    if (!data) return;

    // 페이지 사이즈 변경
    if (pageSize !== params.pageSize) {
      setParams((prev) => {
        const { firstSku: _firstSku, lastSku: _lastSku, direction: _direction, ...rest } = prev;
        return { ...rest, pageSize, pageNo: 0 } as P;
      });

      return;
    }

    // 페이지 번호 변경
    if (page === params.pageNo) return;

    if (page > params.pageNo) {
      // 다음 페이지 클릭
      setParams((prev) => {
        const { firstSku: _, ...rest } = prev;
        return { ...rest, pageNo: page, pageSize, direction: "NEXT", lastSku: data?.pagination.nextCursor } as P;
      });
    } else {
      // 이전 페이지 클릭
      setParams((prev) => {
        const { lastSku: _, ...rest } = prev;
        return { ...rest, pageNo: page, pageSize, direction: "PREVIOUS", firstSku: data?.pagination.previousCursor } as P;
      });
    }
  };

  return { handlePaginationChange };
};

interface StockPIMPaginationParams {
  page: number;
  pageSize: number;
  direction?: string;
  firstSku?: string;
  lastSku?: string;
}

interface StockPIMPaginationData {
  pagination: {
    nextCursor?: string;
    previousCursor?: string;
  };
}

interface StockPIMPaginationProps<P, D> {
  params: P;
  setParams: Dispatch<SetStateAction<P>>;
  data?: D;
}

// OMS 재고 현황 페이지네이션
export const useStockPIMPagination = <P extends StockPIMPaginationParams, D extends StockPIMPaginationData>({ params, setParams, data }: StockPIMPaginationProps<P, D>) => {
  const handlePaginationChange = ({ page, pageSize }: GridPaginationModel) => {
    if (!data) return;

    // 페이지 사이즈 변경
    if (pageSize !== params.pageSize) {
      setParams((prev) => {
        const { firstSku: _firstSku, lastSku: _lastSku, direction: _direction, ...rest } = prev;
        return { ...rest, page: 0, pageSize } as P;
      });
      return;
    }

    // 다음/이전
    setParams((prev) => {
      if (page > prev.page) {
        const { firstSku: _firstSku, ...rest } = prev;
        return { ...rest, page, pageSize, direction: "NEXT", lastSku: data.pagination.nextCursor } as P;
      } else {
        const { lastSku: _lastSku, ...rest } = prev;
        return { ...rest, page, pageSize, direction: "PREVIOUS", firstSku: data.pagination.previousCursor } as P;
      }
    });
  };

  return { handlePaginationChange };
};
