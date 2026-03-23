// src/shared/utils/getLocalTime.ts
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { STORAGE_KEYS } from "@/features/header/modules/constants";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * @description
 * 주어진 date를 로컬스토리지에 저장된 타임존(없으면 브라우저 기본값)에 맞게 변환합니다.
 * @param date 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param tz 직접 지정할 타임존 (optional)
 * @param format 출력 포맷 (기본값: "YYYY-MM-DD HH:mm:ss")
 * @returns 변환된 시간 문자열
 */
export const getLocalTime = (
  date: Date | string,
  tz?: string,
  format: string = "YYYY-MM-DD HH:mm:ss",
): string => {
  try {
    const timezone =
      tz ||
      localStorage.getItem(STORAGE_KEYS.USER_TIMEZONE) ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    return dayjs(date).tz(timezone).format(format);
  } catch (err) {
    console.error("[getLocalTime] Failed to convert time:", err);
    // fallback: 브라우저 기본 포맷으로 반환
    return dayjs(date).format(format);
  }
};
