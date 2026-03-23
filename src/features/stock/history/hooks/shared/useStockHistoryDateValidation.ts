import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useCallback, useState } from "react";
import { UseFormWatch } from "react-hook-form";

import { StockHistorySearchFilterForm } from "@/features/stock/history/models/types";

import { StockHistorySearchRequestPeriodTypeEnum } from "@/shared/generated/oms/types/Stock";

dayjs.extend(minMax);

const MAXIMUM_MONTHS_DIFF = 3;

interface UseStockHistoryDateValidationReturn {
  validateDateRange: () => boolean;
  openDateErrorDialog: boolean;
  setOpenDateErrorDialog: (open: boolean) => void;
  dateErrorMessage: string;
  setDateErrorMessage: (message: string) => void;
  getFromMinDate: () => Dayjs;
  getFromMaxDate: () => Dayjs;
  getToMaxDate: () => Dayjs;
}

export default function useStockHistoryDateValidation(
  watch: UseFormWatch<StockHistorySearchFilterForm>,
): UseStockHistoryDateValidationReturn {
  const [openDateErrorDialog, setOpenDateErrorDialog] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");

  const isDaily =
    watch("periodType") === StockHistorySearchRequestPeriodTypeEnum.DAILY;

  const validateDateRange = useCallback(() => {
    const from = watch("from");
    const to = watch("to");
    const periodType = watch("periodType");
    const isDaily =
      periodType === StockHistorySearchRequestPeriodTypeEnum.DAILY;

    if (!from || !to) {
      return true; // 필수 필드 검증은 다른 곳에서 처리
    }

    const fromDate = dayjs(from);
    const toDate = dayjs(to);

    // from의 minDate 검증
    const fromMinDate = to
      ? dayjs(to).subtract(MAXIMUM_MONTHS_DIFF, "month").startOf("day")
      : dayjs()
          .subtract(isDaily ? 1 : 0, "day")
          .startOf("day");

    if (fromDate.isBefore(fromMinDate)) {
      setDateErrorMessage(
        `Start date cannot be earlier than ${fromMinDate.format("YYYY-MM-DD")}.`,
      );
      setOpenDateErrorDialog(true);
      return false;
    }

    // from의 maxDate 검증
    const fromMaxDate = to
      ? dayjs(to).startOf("day")
      : dayjs()
          .subtract(isDaily ? 1 : 0, "day")
          .startOf("day");

    if (fromDate.isAfter(fromMaxDate)) {
      setDateErrorMessage(
        `Start date cannot be later than ${fromMaxDate.format("YYYY-MM-DD")}.`,
      );
      setOpenDateErrorDialog(true);
      return false;
    }

    // to의 maxDate 검증
    const toMaxDate = from
      ? dayjs.min(
          dayjs(from).add(MAXIMUM_MONTHS_DIFF, "month").endOf("day"),
          dayjs().endOf("day"),
        )
      : dayjs().endOf("day");

    if (toDate.isAfter(toMaxDate)) {
      setDateErrorMessage(
        `End date cannot be later than ${toMaxDate.format("YYYY-MM-DD")}.`,
      );
      setOpenDateErrorDialog(true);
      return false;
    }

    // from과 to의 차이가 MAXIMUM_MONTHS_DIFF 개월을 넘는지 검증
    if (toDate.diff(fromDate, "month", true) > MAXIMUM_MONTHS_DIFF) {
      setDateErrorMessage(
        `The date range cannot exceed ${MAXIMUM_MONTHS_DIFF} months.`,
      );
      setOpenDateErrorDialog(true);
      return false;
    }

    return true;
  }, [watch]);

  // from의 minDate 정의
  // DAILY 일때, to가 있으면 to 날짜의 MAXIMUM_MONTHS_DIFF 개월 전의 startOf("day"), to가 없으면 오늘 날짜 하루 전의 startOf("day")
  // HOURLY 일때, to가 있으면 to 날짜의 MAXIMUM_MONTHS_DIFF 개월 전의 startOf("day"), to가 없으면 오늘 날짜의 startOf("day")
  const getFromMinDate = () => {
    return watch("to")
      ? dayjs(watch("to")).subtract(MAXIMUM_MONTHS_DIFF, "month").startOf("day")
      : dayjs()
          .subtract(isDaily ? 1 : 0, "day")
          .startOf("day");
  };

  // from의 maxDate 정의
  // DAILY 일때, to가 있으면 to 날짜의 startOf("day"), to가 없으면 오늘 날짜의 하루 전의 startOf("day")
  // HOURLY 일때, to가 있으면 to 날짜의 startOf("day"), to가 없으면 오늘 날짜의 startOf("day")
  const getFromMaxDate = () => {
    return watch("to")
      ? dayjs(watch("to")).startOf("day")
      : dayjs()
          .subtract(isDaily ? 1 : 0, "day")
          .startOf("day");
  };

  // to의 maxDate 정의
  // DAILY 일때, from이 있으면 from 날짜의 MAXIMUM_MONTHS_DIFF 개월 후의 endOf("day")와 오늘 날짜 하루 전의 endOf("day") 중 더 빠른 날짜, from이 없으면 오늘 날짜의 하루 전의 endOf("day")
  // HOURLY 일때, from이 있으면 from 날짜의 MAXIMUM_MONTHS_DIFF 개월 후의 endOf("day")와 오늘 날짜의 endOf("day") 중 더 빠른 날짜, from이 없으면 오늘 날짜의 endOf("day")
  const getToMaxDate = () => {
    return watch("from")
      ? dayjs.min(
          dayjs(watch("from")).add(MAXIMUM_MONTHS_DIFF, "month").endOf("day"),
          dayjs().endOf("day"),
        )
      : dayjs().endOf("day");
  };

  return {
    validateDateRange,
    openDateErrorDialog,
    setOpenDateErrorDialog,
    dateErrorMessage,
    setDateErrorMessage,
    getFromMinDate,
    getFromMaxDate,
    getToMaxDate,
  };
}
