"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ALWAYS_ON_FILTER_OPTIONS,
  AlwaysOnFilter,
  CALENDAR_CHANNEL_COLORS,
  CALENDAR_FALLBACK_COLOR,
} from "@/features/promotion-list/modules/constants";
import { PromotionRow } from "@/features/promotion-list/modules/mockData";

import { useTimezoneStore } from "@/shared/stores/useTimezoneStore";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_LANES = 4;
const LANE_HEIGHT = 23;
const BAR_TOP = 30;

const STATUS_CHIP: Record<
  string,
  { color: "success" | "warning" | "default"; sx?: object }
> = {
  Active: { color: "success" },
  Scheduled: { color: "warning" },
  Ended: {
    color: "default",
    sx: { backgroundColor: "#9E9E9E", color: "#FFF" },
  },
  Draft: {
    color: "default",
    sx: { backgroundColor: "#42A5F5", color: "#FFF" },
  },
  Deleted: {
    color: "default",
    sx: { backgroundColor: "#C62828", color: "#FFF" },
  },
};

// "YYYY.MM.DD HH:mm:ss" → "YYYY-MM-DD"
const toDateKey = (s: string) => {
  if (!s) return "";
  const d = dayjs(s.trim().split(/\s+/)[0].replace(/\./g, "-"));
  return d.isValid() ? d.format("YYYY-MM-DD") : "";
};
const fmtPeriod = (s: string) => {
  if (!s) return "";
  const d = dayjs(s.replace(/\./g, "-"));
  return d.isValid() ? d.format("MM/DD HH:mm") : s;
};
const channelOf = (row: PromotionRow) => row.triggerChannels[0] ?? "";
const PROMOTION_TYPE_LABEL: Record<
  NonNullable<PromotionRow["promotionType"]>,
  string
> = {
  GWP: "GWP · Free Gift",
  PACKAGE: "Packaging Benefit",
};
const promotionTypeOf = (row: PromotionRow) =>
  PROMOTION_TYPE_LABEL[row.promotionType ?? "GWP"];

// 상태 텍스트 토글 — 상태명을 색상 pill 로 표시 (리스트 Status 칩과 동일한 색상 규칙)
const STATUS_TAG_BG: Record<PromotionRow["status"], string> = {
  Active: "#2E7D32",
  Scheduled: "#ED6C02",
  Ended: "#9E9E9E",
  Draft: "#42A5F5",
  Deleted: "#C62828",
};
function StatusTag({ status }: { status: PromotionRow["status"] }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full px-[6px] align-middle text-[9.5px] font-semibold uppercase leading-[14px] tracking-[0.02em] text-white"
      style={{ background: STATUS_TAG_BG[status] ?? "#9E9E9E" }}
    >
      {status}
    </span>
  );
}

const colorOf = (channel: string) =>
  CALENDAR_CHANNEL_COLORS[channel] ?? CALENDAR_FALLBACK_COLOR;

interface PlacedBar {
  row: PromotionRow;
  startIdx: number;
  endIdx: number;
  lane: number;
  clipStart: boolean;
  clipEnd: boolean;
}

interface PromotionCalendarProps {
  rows: PromotionRow[];
}

export default function PromotionCalendar({ rows }: PromotionCalendarProps) {
  const { timezone } = useTimezoneStore();
  const todayKey = dayjs().tz(timezone).format("YYYY-MM-DD");

  const [month, setMonth] = useState<Dayjs>(() =>
    dayjs().tz(timezone).startOf("month"),
  );
  const [alwaysOnFilter, setAlwaysOnFilter] =
    useState<AlwaysOnFilter>("include");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 검색 결과가 바뀌면 선택 해제
  useEffect(() => {
    setSelectedId(null);
  }, [rows]);

  // 채널 필터는 검색 조건(Channel)으로 처리하므로 캘린더에서는 별도 토글 없음
  const visibleRows = rows;
  const alwaysRows = useMemo(
    () =>
      alwaysOnFilter === "exclude" ? [] : visibleRows.filter((r) => r.alwaysOn),
    [visibleRows, alwaysOnFilter],
  );
  const timedRows = useMemo(
    () =>
      alwaysOnFilter === "only"
        ? []
        : visibleRows.filter((r) => !r.alwaysOn && toDateKey(r.endDate)),
    [visibleRows, alwaysOnFilter],
  );

  // 이번 달 그리드 (일요일 시작, 7의 배수로 채움)
  const weeks = useMemo(() => {
    const first = month.startOf("month");
    const gridStart = first.subtract(first.day(), "day");
    const daysInMonth = month.daysInMonth();
    const total = Math.ceil((first.day() + daysInMonth) / 7) * 7;
    const cells: Dayjs[] = [];
    for (let i = 0; i < total; i += 1) cells.push(gridStart.add(i, "day"));
    const out: Dayjs[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [month]);

  const placeWeek = useCallback(
    (week: Dayjs[]) => {
      const keys = week.map((d) => d.format("YYYY-MM-DD"));
      const ws = keys[0];
      const we = keys[6];
      const inWeek = timedRows
        .map((row) => ({
          row,
          s: toDateKey(row.startDate),
          e: toDateKey(row.endDate),
        }))
        .filter(({ s, e }) => s <= we && e >= ws)
        .sort((a, b) => (a.s < b.s ? -1 : a.s > b.s ? 1 : a.e > b.e ? -1 : 1));

      const lanes: Array<Array<[number, number]>> = [];
      const placed: PlacedBar[] = [];
      inWeek.forEach(({ row, s, e }) => {
        const startIdx = s < ws ? 0 : keys.indexOf(s);
        const endIdx = e > we ? 6 : keys.indexOf(e);
        let lane = lanes.findIndex((l) =>
          l.every(([a, b]) => endIdx < a || startIdx > b),
        );
        if (lane < 0) {
          lanes.push([]);
          lane = lanes.length - 1;
        }
        lanes[lane].push([startIdx, endIdx]);
        placed.push({
          row,
          startIdx,
          endIdx,
          lane,
          clipStart: s < ws,
          clipEnd: e > we,
        });
      });
      return { placed, laneCount: lanes.length };
    },
    [timedRows],
  );

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const handleToday = useCallback(
    () => setMonth(dayjs().tz(timezone).startOf("month")),
    [timezone],
  );

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Header: month nav / Today / always-on filter */}
      <div className="flex flex-wrap items-center gap-[4px]">
        <IconButton
          size="small"
          aria-label="Previous month"
          onClick={() => setMonth((m) => m.subtract(1, "month"))}
        >
          <ChevronLeftIcon />
        </IconButton>
        <h3 className="min-w-[150px] text-center text-[18px] font-semibold text-black">
          {month.format("MMMM YYYY")}
        </h3>
        <IconButton
          size="small"
          aria-label="Next month"
          onClick={() => setMonth((m) => m.add(1, "month"))}
        >
          <ChevronRightIcon />
        </IconButton>
        <Button
          variant="outlined"
          size="small"
          onClick={handleToday}
          sx={{ ml: 1 }}
        >
          Today
        </Button>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={alwaysOnFilter}
          onChange={(_, v: AlwaysOnFilter | null) => {
            if (v) setAlwaysOnFilter(v);
          }}
          aria-label="Always-on filter"
          sx={{ ml: 1 }}
        >
          {ALWAYS_ON_FILTER_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt.value}
              value={opt.value}
              sx={{ textTransform: "none", px: 1.5, py: 0.5 }}
            >
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {/* Always-on strip */}
      {alwaysOnFilter !== "exclude" && (
        <div className="flex flex-wrap items-center gap-[8px] rounded-[8px] bg-[#F6EBD2] px-[12px] py-[8px] text-[12.5px] text-black/70">
          <b className="text-[#9A6A12]">Always-on {alwaysRows.length}</b>
          {alwaysRows.length === 0 && (
            <span className="text-black/50">
              No always-on promotions in the current result.
            </span>
          )}
          {alwaysRows.map((r) => {
            const c = colorOf(channelOf(r));
            const isSel = r.id === selectedId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className="inline-flex items-center gap-[6px] rounded-[6px] border bg-white px-[9px] py-[3px] text-[12px] text-black"
                style={{
                  borderColor: isSel ? c.main : "#E0E0E0",
                  borderStyle: r.status === "Draft" ? "dashed" : "solid",
                }}
                title={`${r.title}\n${channelOf(r)} · ${r.status}\n${fmtPeriod(r.startDate)} ~ Always-on`}
              >
                <StatusTag status={r.status} />
                {r.title}
                <span className="text-black/50">· {channelOf(r)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-[10px] border border-[#E0E0E0]">
        <div className="grid grid-cols-7 border-b border-[#E0E0E0] bg-[#F5F5F5]">
          {DOW.map((d) => (
            <div
              key={d}
              className="text-black/54 px-[8px] py-[6px] text-center text-[12px] font-medium"
            >
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => {
          const { placed, laneCount } = placeWeek(week);
          const shown = placed.filter((p) => p.lane < MAX_LANES);
          const hidden = placed.length - shown.length;
          const laneRows = Math.min(laneCount, MAX_LANES) + (hidden ? 1 : 0);
          const minHeight = BAR_TOP + laneRows * LANE_HEIGHT + 8;
          return (
            <div
              key={wi}
              className="relative grid grid-cols-7 border-b border-[#E0E0E0] last:border-b-0"
              style={{ minHeight: Math.max(minHeight, 96) }}
            >
              {week.map((d) => {
                const key = d.format("YYYY-MM-DD");
                const out = d.month() !== month.month();
                const isToday = key === todayKey;
                return (
                  <div
                    key={key}
                    className="border-r border-[#E0E0E0] px-[8px] py-[6px] text-[12px] last:border-r-0"
                    style={{
                      color: out ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)",
                      background: out ? "#FAFAFA" : "#FFF",
                    }}
                  >
                    <span
                      className="inline-block rounded-full px-[6px] leading-[18px]"
                      style={
                        isToday
                          ? {
                              background: "#42A5F5",
                              color: "#FFF",
                              fontWeight: 600,
                            }
                          : undefined
                      }
                    >
                      {d.date()}
                    </span>
                  </div>
                );
              })}

              {/* bars */}
              <div
                className="pointer-events-none absolute left-0 right-0 grid grid-cols-7 px-[2px]"
                style={{
                  top: BAR_TOP,
                  gridAutoRows: 20,
                  rowGap: 3,
                }}
              >
                {shown.map((p) => {
                  const c = colorOf(channelOf(p.row));
                  const isSel = p.row.id === selectedId;
                  const isDraft = p.row.status === "Draft";
                  return (
                    <button
                      key={p.row.id}
                      type="button"
                      onClick={() => setSelectedId(p.row.id)}
                      title={`${p.row.title}\n${channelOf(p.row)} · ${p.row.status}\n${fmtPeriod(p.row.startDate)} → ${fmtPeriod(p.row.endDate)}`}
                      className="pointer-events-auto overflow-hidden text-ellipsis whitespace-nowrap px-[7px] text-left text-[11.5px] font-medium leading-[20px]"
                      style={{
                        gridColumn: `${p.startIdx + 1} / span ${p.endIdx - p.startIdx + 1}`,
                        gridRow: p.lane + 1,
                        background: isDraft ? "transparent" : c.soft,
                        color: c.main,
                        // Draft 는 점선 테두리, 그 외는 왼쪽 컬러 바 (주 경계에서 잘린 경우 생략)
                        border: isDraft
                          ? `1px dashed ${c.main}`
                          : "1px solid transparent",
                        borderLeft: p.clipStart
                          ? isDraft
                            ? "1px dashed transparent"
                            : "1px solid transparent"
                          : `3px ${isDraft ? "dashed" : "solid"} ${c.main}`,
                        outline: isSel ? `2px solid ${c.main}` : undefined,
                        outlineOffset: isSel ? -1 : undefined,
                        marginLeft: p.clipStart ? 0 : 3,
                        marginRight: p.clipEnd ? 0 : 3,
                        borderRadius: `${p.clipStart ? 0 : 4}px ${p.clipEnd ? 0 : 4}px ${p.clipEnd ? 0 : 4}px ${p.clipStart ? 0 : 4}px`,
                        opacity: p.row.status === "Ended" ? 0.55 : 1,
                      }}
                    >
                      <StatusTag status={p.row.status} />
                      <span className="ml-[5px]">{p.row.title}</span>
                      <span className="ml-[4px] font-normal opacity-70">
                        · {channelOf(p.row)}
                      </span>
                    </button>
                  );
                })}
                {hidden > 0 && (
                  <div
                    className="px-[7px] text-[11.5px] leading-[20px] text-black/50"
                    style={{
                      gridColumn: "1 / span 7",
                      gridRow: MAX_LANES + 1,
                    }}
                  >
                    +{hidden} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="grid grid-cols-[1fr_auto] items-start gap-[12px] rounded-[10px] border border-[#E0E0E0] bg-[#F5F5F5] px-[16px] py-[14px]">
          <div>
            <h4 className="mb-[6px] flex items-center gap-[8px] text-[14px] font-semibold text-black">
              <i
                className="inline-block h-[10px] w-[10px] rounded-full"
                style={{ background: colorOf(channelOf(selected)).main }}
              />
              {selected.title}
            </h4>
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-[12px] gap-y-[4px] text-[12.5px] text-black">
              <span className="text-black/54">Channel</span>
              <span>{selected.triggerChannels.join(", ")}</span>
              <span className="text-black/54">Status</span>
              <span className="flex items-center gap-[6px]">
                <Chip
                  label={selected.status}
                  size="small"
                  color={STATUS_CHIP[selected.status]?.color ?? "default"}
                  sx={STATUS_CHIP[selected.status]?.sx}
                />
              </span>
              <span className="text-black/54">Period</span>
              <span>
                {selected.alwaysOn
                  ? `${fmtPeriod(selected.startDate)} ~ Always-on`
                  : `${fmtPeriod(selected.startDate)} → ${fmtPeriod(selected.endDate)}`}
              </span>
              <span className="text-black/54">Promotion Type</span>
              <span>{promotionTypeOf(selected)}</span>
              <span className="text-black/54">Reward</span>
              <span>
                {selected.rewardProducts
                  .map((p) => `${p.productName} - ${p.skuCode}`)
                  .join(", ")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-[6px]">
            <Button
              component={Link}
              href={`/promotion/promotion-list/edit-v2/${selected.id}`}
              variant="outlined"
              size="small"
            >
              Open Promotion
            </Button>
            <IconButton
              size="small"
              aria-label="Close detail"
              onClick={() => setSelectedId(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
