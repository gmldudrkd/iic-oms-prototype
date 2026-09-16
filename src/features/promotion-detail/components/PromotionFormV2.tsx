"use client";

import AddIcon from "@mui/icons-material/Add";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RemoveIcon from "@mui/icons-material/Remove";
import ScienceIcon from "@mui/icons-material/Science";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CurrencyInfo,
  currencyForCorp,
  formatMoney,
} from "@/features/promotion-detail/modules/constants";
import {
  MOCK_PROMOTIONS,
  PromotionRow,
} from "@/features/promotion-list/modules/mockData";
import TemplatePickerDialog from "@/features/promotion-template/components/TemplatePickerDialog";
import {
  TemplateFormBridge,
  bridgeToDraft,
  templateToBridge,
} from "@/features/promotion-template/modules/formBridge";
import { createTemplate } from "@/features/promotion-template/modules/mockData";
import type { PromotionTemplate } from "@/features/promotion-template/modules/types";

import AlertDialog from "@/shared/components/dialog/AlertDialog";
import { channelsFor } from "@/shared/constants/brandCorpChannels";
import useSnackbarStore from "@/shared/stores/useSnackbarStore";
import { useUserPermissionStore } from "@/shared/stores/useUserPermissionStore";

// ---- palette (현재 앱 톤에 맞춘 중립/프라이머리 조합) ----
const BORDER = "#E0E0E0";
const BORDER_STRONG = "#C4C4C4";
const SURFACE_ALT = "#FAFAFA";
const SURFACE_SUNKEN = "#F0F0F0";
const BRAND = "#1976D2";
const BRAND_STRONG = "#115293";
const BRAND_SOFT = "#E9F2FE";
const BRAND_TINT = "#DCEAFB";
const PRICE = "#C2410C";
const SUCCESS = "#2E7D32";
const SUCCESS_BG = "#E8F3E9";
const WARNING = "#B26A00";
const WARNING_BG = "#FBF0DC";
const DANGER = "#C62828";
const DANGER_BG = "#FBE9E9";
const TEXT_PRIMARY = "rgba(0,0,0,0.87)";
const TEXT_SECONDARY = "rgba(0,0,0,0.6)";
const TEXT_TERTIARY = "rgba(0,0,0,0.4)";

// ---- mock data (참고 HTML 기준) ----
interface Product {
  id: string;
  name: string;
  price: number;
  sap: string;
  modelCode: string;
  category: string;
}
const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Ten Perfume 50ml",
    price: 32000,
    sap: "TAM-PF-050",
    modelCode: "MDL-PF-050",
    category: "Fragrance",
  },
  {
    id: "p2",
    name: "Cica Hand Cream 30ml",
    price: 18000,
    sap: "TAM-HC-030",
    modelCode: "MDL-HC-030",
    category: "Hand Care",
  },
  {
    id: "p3",
    name: "Perfume Balm 6.5g",
    price: 42000,
    sap: "TAM-PB-006",
    modelCode: "MDL-PB-006",
    category: "Fragrance",
  },
  {
    id: "p4",
    name: "Body Perfume Mist 100ml",
    price: 45000,
    sap: "TAM-BD-100",
    modelCode: "MDL-BD-100",
    category: "Body",
  },
  {
    id: "p5",
    name: "Perfume Gift Set",
    price: 89000,
    sap: "TAM-GF-001",
    modelCode: "MDL-GF-001",
    category: "Gift Set",
  },
  {
    id: "p6",
    name: "Hand Perfume 30ml",
    price: 28000,
    sap: "TAM-HP-030",
    modelCode: "MDL-HP-030",
    category: "Hand Care",
  },
  {
    id: "p7",
    name: "Shower Perfume Gel 300ml",
    price: 34000,
    sap: "TAM-BD-300",
    modelCode: "MDL-BD-300",
    category: "Body",
  },
  {
    id: "p8",
    name: "Perfume Hand Wash 250ml",
    price: 26000,
    sap: "TAM-HC-250",
    modelCode: "MDL-HC-250",
    category: "Hand Care",
  },
  {
    id: "p9",
    name: "Mini Perfume Trio 6.5ml×3",
    price: 52000,
    sap: "TAM-GF-003",
    modelCode: "MDL-GF-003",
    category: "Gift Set",
  },
  {
    id: "p10",
    name: "Cica Balm 30ml",
    price: 24000,
    sap: "TAM-HC-031",
    modelCode: "MDL-HC-031",
    category: "Hand Care",
  },
  {
    id: "pk1",
    name: "Basic Gift Wrap",
    price: 3000,
    sap: "TAM-PKG-001",
    modelCode: "MDL-PKG-001",
    category: "Package",
  },
  {
    id: "pk2",
    name: "Premium Gift Box",
    price: 8000,
    sap: "TAM-PKG-002",
    modelCode: "MDL-PKG-002",
    category: "Package",
  },
  {
    id: "pk3",
    name: "Season Limited Package",
    price: 12000,
    sap: "TAM-PKG-003",
    modelCode: "MDL-PKG-003",
    category: "Package",
  },
  {
    id: "pk4",
    name: "Classic Satin Ribbon",
    price: 2000,
    sap: "TAM-PKG-004",
    modelCode: "MDL-PKG-004",
    category: "Package",
  },
  {
    id: "pk5",
    name: "Handwritten Message Card",
    price: 1500,
    sap: "TAM-PKG-005",
    modelCode: "MDL-PKG-005",
    category: "Package",
  },
];
// Brand & Corp 조합에 따른 판매 채널 목록 — shared 공통 매핑(channelsFor) 사용
const GOALS = [
  "Increase Sales",
  "Acquire New Customers",
  "Drive Repurchase",
  "Promote New Products",
  "Clear Inventory",
  "Boost Brand Awareness",
];

type PromoType = "gwp" | "package";
type CondMode = "products" | "amount" | "allProducts";
type ProductMatch = "any" | "all";
type RewardBasis = "order" | "product";
// 증정 방식 (Target = Specific Product / Order Amount 일 때 노출)
type RewardGive = "default" | "option";

// Option Select 증정 시 고객이 고를 수 있는 Reward 제품 최대 개수
const OPTION_REWARD_MAX = 10;

// Target = Order Amount 일 때 등록할 수 있는 주문 금액 구간 최대 개수
const MAX_AMOUNT_RANGES = 5;

// 구간 배지 색상 (구간 순서대로 순환)
const RANGE_COLORS = ["#1F6FE5", "#7C3AED", "#C2410C", "#0F766E", "#BE185D"];
const rangeColor = (i: number) => RANGE_COLORS[i % RANGE_COLORS.length];

// 주문 금액 구간 — 하한 포함(>=), 상한 미포함(<). 무제한은 마지막 구간만 가능
interface AmountRange {
  id: string;
  min: number;
  max: number;
  unlimited: boolean;
}

let rangeSeq = 0;
const makeRange = (min = 0, max = 0, unlimited = false): AmountRange => ({
  id: `range-${++rangeSeq}`,
  min,
  max,
  unlimited,
});

// Reward 재고는 (구간, 제품) 조합마다 따로 관리한다
const invKeyOf = (productId: string, rangeId?: string) =>
  rangeId ? `${rangeId}::${productId}` : productId;

// Reward 제품 재고 입력 필드 (remaining = total - sold 로 자동 계산)
const INVENTORY_FIELDS = ["total", "sold", "remaining", "alert"] as const;
type InventoryField = (typeof INVENTORY_FIELDS)[number];
const INVENTORY_FIELD_LABELS: Record<InventoryField, string> = {
  total: "Total",
  sold: "Sold",
  remaining: "Remaining",
  alert: "Alert",
};

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
}
interface Inventory {
  total: number;
  sold: number;
  alert: number;
}

interface FormState {
  name: string;
  goal: string;
  goalCustom: string;
  promoType: PromoType;
  start: string;
  end: string;
  always: boolean;
  condMode: CondMode;
  productMatch: ProductMatch;
  buyQty: number;
  rewardBasis: RewardBasis;
  rewardGive: RewardGive;
  targets: SelectedProduct[];
  excludeTargets: SelectedProduct[];
  rewardProducts: SelectedProduct[];
  inventory: Record<string, Inventory>;
  // Target = Order Amount: 금액 구간 목록 (구간별로 Reward 제품을 따로 설정)
  amountRanges: AmountRange[];
  // 구간 id -> 해당 구간의 Reward 제품 목록
  rangeRewards: Record<string, SelectedProduct[]>;
  channels: Record<string, boolean>;
}

// ---- helpers ----
// 금액 표기는 상단 헤더 Brand & Corp 에서 선택한 법인(국가)의 통화를 따른다.
// (모듈 스코프 헬퍼는 currency 를 인자로 받고, 컴포넌트 내부에서는 won() 으로 감싼다)

// 통화별 허용 소수점 자리로 금액 반올림 (KRW/JPY 는 정수)
const roundToCurrency = (n: number, c: CurrencyInfo) => {
  const f = 10 ** c.fractionDigits;
  return Math.round((Number(n) || 0) * f) / f;
};

// 구간 표기: ">= 50,000 ~ < 100,000" / ">= 200,000 ~ Unlimited"
const rangeText = (r: AmountRange, c: CurrencyInfo) =>
  `≥ ${formatMoney(r.min, c)} ~ ${
    r.unlimited ? "Unlimited" : `< ${formatMoney(r.max, c)}`
  }`;

// 제품 검색 조건 (검색 기준 선택 + 복수 키워드)
type SearchField = "name" | "sap" | "modelCode";
const SEARCH_FIELD_OPTIONS: { value: SearchField; label: string }[] = [
  { value: "name", label: "Product Name" },
  { value: "sap", label: "SAP Code" },
  { value: "modelCode", label: "ModelPack2" },
];
const fieldValue = (p: Product, field: SearchField) =>
  field === "sap" ? p.sap : field === "modelCode" ? p.modelCode : p.name;
// 줄바꿈으로 구분된 복수 키워드 중 하나라도 매칭되면 노출 (선택한 기준 필드 기준)
const matchProduct = (p: Product, field: SearchField, q: string) => {
  const keywords = (q || "")
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (keywords.length === 0) return true;
  const v = fieldValue(p, field).toLowerCase();
  return keywords.some((kw) => v.includes(kw));
};
// "YYYY-MM-DD" / "YYYY-MM-DDTHH:mm" 둘 다 처리
const parseDate = (s: string) => {
  if (!s) return new Date(NaN);
  const [datePart, timePart = ""] = s.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
};
const fmtDate = (dt: Date) => {
  if (isNaN(dt.getTime())) return "-";
  const base = `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, "0")}. ${String(
    dt.getDate(),
  ).padStart(2, "0")}`;
  // 진행바 라벨에도 항상 시간(HH:mm) 표기
  return `${base} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
};

const DAY = 86400000;

// Purchase Quantity 입력 범위 (정수, 0 및 음수 불가)
const BUY_QTY_MIN = 1;
const BUY_QTY_MAX = 99;

interface PeriodVM {
  statusLabel: string;
  dday: string;
  durationLabel: string;
  startLabel: string;
  endLabel: string;
  todayLabel: string;
  color: string;
  bg: string;
  pct: number;
}
function computePeriod(f: FormState): PeriodVM {
  const start = parseDate(f.start);
  // 조회한 현재 시각 (시간 포함) — Today 라벨/진행률 계산에 사용
  const today = new Date();
  let status: "upcoming" | "active" | "ended";
  let dday: string;
  let endLabel: string;
  let pct: number;
  let durationLabel: string;
  if (!f.always && !f.end) {
    // 종료일 미선택 (신규 등록 초기 상태)
    const upcoming = today < start;
    return {
      statusLabel: upcoming ? "Scheduled" : "Active",
      dday: upcoming
        ? `Starts D-${Math.ceil((start.getTime() - today.getTime()) / DAY)}`
        : "In progress",
      durationLabel: "Set an end date",
      startLabel: fmtDate(start),
      endLabel: "—",
      todayLabel: fmtDate(today),
      color: upcoming ? WARNING : SUCCESS,
      bg: upcoming ? WARNING_BG : SUCCESS_BG,
      pct: 0,
    };
  }
  if (f.always) {
    status = today < start ? "upcoming" : "active";
    dday =
      today < start
        ? `Starts D-${Math.ceil((start.getTime() - today.getTime()) / DAY)}`
        : `Day D+${Math.floor((today.getTime() - start.getTime()) / DAY)}`;
    endLabel = "Always";
    pct = today < start ? 0 : 100;
    durationLabel = "Always on";
  } else {
    const end = parseDate(f.end);
    durationLabel = `Total ${Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / DAY) + 1,
    )} days`;
    endLabel = fmtDate(end);
    if (today < start) {
      status = "upcoming";
      dday = `Starts D-${Math.ceil((start.getTime() - today.getTime()) / DAY)}`;
      pct = 0;
    } else if (today > end) {
      status = "ended";
      dday = "Ended";
      pct = 100;
    } else {
      status = "active";
      const left = Math.round((end.getTime() - today.getTime()) / DAY);
      dday = left === 0 ? "Ends D-DAY" : `Ends D-${left}`;
      pct = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((today.getTime() - start.getTime()) /
              (end.getTime() - start.getTime())) *
              100,
          ),
        ),
      );
    }
  }
  const colorMap = {
    upcoming: { color: WARNING, bg: WARNING_BG },
    active: { color: SUCCESS, bg: SUCCESS_BG },
    ended: { color: TEXT_TERTIARY, bg: SURFACE_SUNKEN },
  };
  const labelMap = { upcoming: "Scheduled", active: "Active", ended: "Ended" };
  return {
    statusLabel: labelMap[status],
    dday,
    durationLabel,
    startLabel: fmtDate(start),
    endLabel,
    todayLabel: fmtDate(today),
    color: colorMap[status].color,
    bg: colorMap[status].bg,
    pct,
  };
}

// ---- small UI atoms ----
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>
      {children}
    </Typography>
  );
}

function SectionCard({
  num,
  title,
  desc,
  children,
}: {
  num: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        p: "28px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "999px",
            background: BRAND_SOFT,
            color: BRAND,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {num}
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{title}</Typography>
      </Box>
      {desc && (
        <Typography
          sx={{ m: "0 0 20px 42px", fontSize: 13, color: TEXT_SECONDARY }}
        >
          {desc}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// 알약형 세그먼트 (ToggleButtonGroup 기반)
function Segmented<T extends string>({
  value,
  onChange,
  options,
  disabled,
}: {
  value: T;
  onChange: (v: T) => void;
  // 옵션 단위 disabled 로 특정 선택지만 비활성화할 수 있다
  options: { value: T; label: string; disabled?: boolean }[];
  disabled?: boolean;
}) {
  return (
    <ToggleButtonGroup
      exclusive
      disabled={disabled}
      value={value}
      onChange={(_, v) => v && onChange(v as T)}
      sx={{
        background: SURFACE_SUNKEN,
        p: "4px",
        borderRadius: "999px",
        gap: "6px",
        flexWrap: "wrap",
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          px: 2.25,
          py: 1,
          fontSize: 13,
          fontWeight: 500,
          color: TEXT_SECONDARY,
          lineHeight: 1.2,
        },
        "& .MuiToggleButton-root.Mui-selected": {
          background: "#fff",
          color: BRAND,
          fontWeight: 600,
          boxShadow: "0 1px 2px rgba(0,0,0,.08)",
          "&:hover": { background: "#fff" },
        },
      }}
    >
      {options.map((o) => (
        <ToggleButton key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: "10px",
    fontSize: 14,
    background: "#fff",
    "& fieldset": { borderColor: BORDER, borderWidth: "1.5px" },
  },
};

// 제품 검색 블록
function SearchBlock({
  label,
  note,
  subNote,
  query,
  field,
  onField,
  matches,
  onQuery,
  onAddOne,
  onAddAll,
  clearCount,
  onClearAll,
  currency,
}: {
  label: string;
  note: string;
  subNote?: string;
  query: string;
  field: SearchField;
  onField: (v: SearchField) => void;
  matches: Product[];
  onQuery: (v: string) => void;
  onAddOne: (id: string) => void;
  onAddAll: () => void;
  clearCount?: number;
  onClearAll?: () => void;
  currency: CurrencyInfo;
}) {
  const shown = matches.slice(0, 8);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        p: "16px 18px",
        background: SURFACE_ALT,
        border: `1px solid ${BORDER}`,
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {matches.length > 0 && (
            <Button
              onClick={onAddAll}
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: "none",
                height: 28,
                borderRadius: "999px",
                border: `1px solid ${BRAND}`,
                background: BRAND_SOFT,
                color: BRAND_STRONG,
                fontSize: 11,
                fontWeight: 600,
                px: 1.5,
              }}
            >
              Select all ({matches.length})
            </Button>
          )}
          {!!clearCount && onClearAll && (
            <Button
              onClick={onClearAll}
              size="small"
              startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: "none",
                height: 28,
                borderRadius: "999px",
                border: `1px solid ${BORDER_STRONG}`,
                background: "#fff",
                color: TEXT_SECONDARY,
                fontSize: 11,
                fontWeight: 600,
                px: 1.5,
              }}
            >
              Clear all ({clearCount})
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Typography sx={{ fontSize: 11, color: TEXT_TERTIARY }}>
          {note}
        </Typography>
        {subNote && (
          <Typography sx={{ fontSize: 11, color: TEXT_TERTIARY }}>
            {subNote}
          </Typography>
        )}
      </Box>
      {/* 검색 기준 선택 + 복수 키워드(줄바꿈 구분) 입력 */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
        <Select
          value={field}
          onChange={(e) => onField(e.target.value as SearchField)}
          size="small"
          sx={{
            flex: "none",
            minWidth: 150,
            alignSelf: "flex-start",
            borderRadius: "10px",
            background: "#fff",
            fontSize: 13,
            "& fieldset": { borderColor: BORDER, borderWidth: "1.5px" },
          }}
        >
          {SEARCH_FIELD_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Enter multiple keywords separated by line breaks"
          size="small"
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ alignSelf: "flex-start", mt: "6px" }}
              >
                <SearchIcon sx={{ fontSize: 18, color: TEXT_TERTIARY }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              fontSize: 13,
              alignItems: "flex-start",
              "& fieldset": { borderColor: BORDER, borderWidth: "1.5px" },
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {shown.length ? (
          shown.map((p) => (
            <Box
              key={p.id}
              onClick={() => onAddOne(p.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: "9px 12px",
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                "&:hover": { borderColor: BRAND, background: BRAND_SOFT },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: TEXT_TERTIARY }}>
                  {p.sap} · {p.modelCode} · {p.category}
                </Typography>
              </Box>
              <Typography
                sx={{ flex: "none", color: TEXT_TERTIARY, fontSize: 12 }}
              >
                {formatMoney(p.price, currency)}
              </Typography>
              <AddIcon sx={{ fontSize: 16, color: BRAND }} />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              p: 1.5,
              textAlign: "center",
              fontSize: 13,
              color: TEXT_TERTIARY,
            }}
          >
            No results found.
          </Box>
        )}
      </Box>
      {matches.length > shown.length && (
        <Typography
          sx={{ textAlign: "center", fontSize: 11, color: TEXT_TERTIARY }}
        >
          {matches.length - shown.length} more · use [Select all] to add at once
        </Typography>
      )}
    </Box>
  );
}

// 선택된 제품 헤더
function ListHeader({
  label,
  count,
  onClear,
  disabled,
}: {
  label: string;
  count: number;
  onClear: () => void;
  disabled?: boolean;
}) {
  if (!count) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>
        {label}{" "}
        <Box component="span" sx={{ color: BRAND_STRONG, fontWeight: 600 }}>
          {count}
        </Box>
      </Typography>
      {!disabled && (
        <Button
          onClick={onClear}
          size="small"
          startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: "none",
            height: 28,
            borderRadius: "999px",
            border: `1px solid ${BORDER_STRONG}`,
            background: "#fff",
            color: TEXT_SECONDARY,
            fontSize: 11,
            fontWeight: 600,
            px: 1.5,
          }}
        >
          Remove all selected
        </Button>
      )}
    </Box>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        border: `1px dashed ${BORDER_STRONG}`,
        borderRadius: "10px",
        fontSize: 13,
        color: TEXT_TERTIARY,
      }}
    >
      {text}
    </Box>
  );
}

type Mode = "add" | "edit";

// 현재 시각을 datetime-local 값("YYYY-MM-DDTHH:00")으로 (분은 00 고정, 시 단위)
const nowLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:00`;
};

// 신규 등록: 기본값 없음 (셀렉트/라디오는 첫 값, 시작일=오늘, 종료일 미선택)
const makeEmptyForm = (): FormState => ({
  name: "",
  goal: GOALS[0],
  goalCustom: "",
  promoType: "gwp",
  start: nowLocal(),
  end: "",
  always: false,
  condMode: "products",
  productMatch: "any",
  buyQty: 1,
  rewardBasis: "order",
  rewardGive: "default",
  targets: [],
  excludeTargets: [],
  rewardProducts: [],
  inventory: {},
  amountRanges: [makeRange()],
  rangeRewards: {},
  channels: {},
});

// "2026.08.09 00:00:00" → "2026-08-09T00:00" (datetime-local 값)
const toISO = (s: string) => {
  if (!s) return "";
  const [datePart, timePart = ""] = s.trim().split(/\s+/);
  const d = datePart.replace(/\./g, "-");
  const hm = timePart.slice(0, 5) || "00:00";
  return `${d}T${hm}`;
};

interface EditData {
  form: FormState;
  status: PromotionRow["status"];
  channelsList: string[];
  // 저장 시점의 법인(국가) — 금액 표기 통화 결정에 사용
  corp: string;
}
// List에서 진입(수정) 시 저장된 값 로드
const loadEditData = (row: PromotionRow): EditData => {
  const inventory: Record<string, Inventory> = {};
  const rewardProducts: SelectedProduct[] = (row.rewardProducts ?? []).map(
    (rp) => {
      // 재고 정보가 있으면 그대로 사용 (재고 소진 Expired 등 반영), 없으면 기본값
      inventory[rp.skuCode] = {
        total: rp.total ?? 200,
        sold: rp.sold ?? 40,
        alert: rp.alert ?? 20,
      };
      return {
        id: rp.skuCode,
        name: rp.productName,
        price: 0,
        category: "Gift Set",
      };
    },
  );
  const isPkgRow = row.promotionType === "PACKAGE";
  // Target = Order Amount 로 저장된 프로모션은 금액 구간 + 구간별 Reward 복원
  const isAmount = !!row.rangeRewards?.length;
  const amountRanges: AmountRange[] = [];
  const rangeRewards: Record<string, SelectedProduct[]> = {};
  (row.rangeRewards ?? []).forEach((rr) => {
    const range = makeRange(rr.min, rr.max, !!rr.unlimited);
    amountRanges.push(range);
    rangeRewards[range.id] = rr.products.map((rp) => {
      inventory[invKeyOf(rp.skuCode, range.id)] = {
        total: rp.total ?? 0,
        sold: rp.sold ?? 0,
        alert: rp.alert ?? 0,
      };
      return {
        id: rp.skuCode,
        name: rp.productName,
        price: 0,
        category: "Gift Set",
      };
    });
  });
  const channels: Record<string, boolean> = {};
  (row.triggerChannels ?? []).forEach((c) => (channels[c] = true));
  // Target = Specific Product 로 저장된 프로모션은 대상 제품까지 복원
  const targets: SelectedProduct[] = (row.targetProducts ?? []).map((tp) => ({
    id: tp.id,
    name: tp.productName,
    price: tp.price,
    category: tp.category,
  }));
  return {
    status: row.status,
    channelsList: Array.from(new Set(row.triggerChannels ?? [])),
    form: {
      name: row.title,
      goal: GOALS[0],
      goalCustom: "",
      promoType: isPkgRow ? "package" : "gwp",
      start: toISO(row.startDate),
      end: toISO(row.endDate),
      always: !!row.alwaysOn,
      condMode: isAmount
        ? "amount"
        : targets.length
          ? "products"
          : "allProducts",
      productMatch: "any",
      buyQty: 1,
      // Packaging Benefit 은 Reward Basis 가 Per product quantity 로 고정
      rewardBasis: isPkgRow ? "product" : "order",
      rewardGive: "default",
      targets,
      excludeTargets: [],
      rewardProducts: isAmount ? [] : rewardProducts,
      inventory,
      amountRanges: isAmount ? amountRanges : [makeRange(0, 0, true)],
      rangeRewards,
      channels,
    },
    corp: row.corp,
  };
};

interface Props {
  mode?: Mode;
  promotionId?: string;
}

export default function PromotionFormV2({ mode = "add", promotionId }: Props) {
  const router = useRouter();

  // edit 진입 시 저장된 프로모션 로드
  const editData = useMemo<EditData | null>(() => {
    if (mode !== "edit" || !promotionId) return null;
    const row = MOCK_PROMOTIONS.find(
      (r) => String(r.id) === String(promotionId),
    );
    return row ? loadEditData(row) : null;
  }, [mode, promotionId]);

  // 상태에 따른 수정 가능 여부
  // Draft/Scheduled: 모든 필드 수정 가능 / 그 외: 일부만 (End Date 제외) 수정
  const status = editData?.status ?? "Draft";
  const isDraftOrScheduled = status === "Draft" || status === "Scheduled";
  // Active/Ended/Deleted: 대부분 필드 잠금 (Reward Total·Alert만 예외)
  const locked = mode === "edit" && !isDraftOrScheduled;
  // Ended/Deleted: 완전 읽기 전용 (아무것도 수정 불가)
  const readOnly =
    mode === "edit" && (status === "Ended" || status === "Deleted");
  // 종료일(End Date)은 Active 상태에서도 수정 가능 (완전 읽기 전용일 때만 잠금)
  const endDateLocked = readOnly;
  // Active: 다른 항목은 잠기지만 Target 제품 "추가"만 예외적으로 허용
  // (이미 진행 중인 프로모션에서 기존 Target을 빼면 혜택이 소급 취소되므로 삭제는 불가)
  // Excluded / Reward 제품은 Active 에서 추가도 불가 (증정 대상 축소 · 재고 재할당을 수반)
  const targetAddOnly = mode === "edit" && status === "Active";
  // Active 진입 시점에 저장돼 있던 Target 제품 (삭제 불가 대상)
  const initialTargetIds = useMemo(
    () => new Set((editData?.form.targets ?? []).map((t) => t.id)),
    [editData],
  );
  // Change Status 액션별 활성 조건
  const canSave = !readOnly; // Save: 언제든 (단 완전 읽기전용 제외)
  const canSaveDraft = mode === "add" || status === "Draft"; // Draft: 생성/Draft
  const canDelete =
    mode === "edit" && (status === "Scheduled" || status === "Draft"); // Delete: Scheduled/Draft
  const canForceStop = mode === "edit" && status === "Active"; // Force Stop: Active

  const [form, setForm] = useState<FormState>(
    () => editData?.form ?? makeEmptyForm(),
  );
  const [targetQuery, setTargetQuery] = useState("");
  const [excludeQuery, setExcludeQuery] = useState("");
  const [rewardQuery, setRewardQuery] = useState("");
  const [targetField, setTargetField] = useState<SearchField>("sap");
  const [excludeField, setExcludeField] = useState<SearchField>("sap");
  const [rewardField, setRewardField] = useState<SearchField>("sap");
  // Order Amount 구간별 Reward 제품 검색 상태 (구간 id 기준)
  const [rangeRewardQuery, setRangeRewardQuery] = useState<
    Record<string, string>
  >({});
  const [rangeRewardField, setRangeRewardField] = useState<
    Record<string, SearchField>
  >({});
  const [simChannel, setSimChannel] = useState("");

  // 상단 헤더의 Brand & Corp 선택(useUserPermissionStore)에 따라 판매 채널 목록 결정
  const selectedPermission = useUserPermissionStore(
    (s) => s.selectedPermission,
  );

  // 금액 표기 통화: add 는 상단 헤더에서 선택한 법인(국가), edit 은 저장 시점의 법인 기준
  // (프로모션 화면은 Brand & Corp 단일 선택이지만, 다중 선택 상태로 진입해도 첫 법인을 사용)
  const currency = useMemo(() => {
    if (mode === "edit" && editData) return currencyForCorp(editData.corp);
    const corp = selectedPermission.find((item) => item.corporations?.length)
      ?.corporations?.[0]?.name;
    return currencyForCorp(corp);
  }, [mode, editData, selectedPermission]);
  const won = useCallback((n: number) => formatMoney(n, currency), [currency]);
  // add 모드에서 Brand & Corp 변경으로 통화가 바뀌면 입력값은 유지하되 재확인을 안내한다
  // (금액 숫자는 그대로 남으므로 사용자가 구간을 다시 확인해야 함)
  const prevCurrencyRef = useRef(currency.code);
  const [currencyChanged, setCurrencyChanged] = useState(false);
  const availableChannels = useMemo(() => {
    // edit: 저장된 프로모션의 채널을 그대로 노출
    if (mode === "edit" && editData) return editData.channelsList;
    // add: 상단 헤더 Brand & Corp 선택 기반
    const result: string[] = [];
    selectedPermission.forEach((item) => {
      const brand = item.brand?.description ?? "";
      item.corporations?.forEach((c) => {
        channelsFor(brand, c.name).forEach((ch) => {
          if (!result.includes(ch)) result.push(ch);
        });
      });
    });
    return result;
  }, [selectedPermission, mode, editData]);

  // Brand & Corp 변경 시 사용 불가 채널 정리 + 테스트 채널 동기화 (add 모드에서만)
  useEffect(() => {
    if (mode === "edit") {
      setSimChannel((prev) =>
        availableChannels.includes(prev) ? prev : (availableChannels[0] ?? ""),
      );
      return;
    }
    setForm((prev) => {
      const channels: Record<string, boolean> = {};
      Object.keys(prev.channels).forEach((k) => {
        if (availableChannels.includes(k) && prev.channels[k])
          channels[k] = true;
      });
      if (Object.keys(channels).length === 0 && availableChannels[0]) {
        channels[availableChannels[0]] = true; // 최소 1개 기본 선택
      }
      return { ...prev, channels };
    });
    setSimChannel((prev) =>
      availableChannels.includes(prev) ? prev : (availableChannels[0] ?? ""),
    );
  }, [availableChannels, mode]);
  // Brand & Corp 변경으로 통화가 바뀌었는데 이미 금액이 입력돼 있으면 재확인 안내
  const amountRangesRef = useRef(form.amountRanges);
  amountRangesRef.current = form.amountRanges;
  useEffect(() => {
    if (prevCurrencyRef.current === currency.code) return;
    prevCurrencyRef.current = currency.code;
    if (mode === "edit") return;
    setCurrencyChanged(
      amountRangesRef.current.some(
        (r) => r.min > 0 || (!r.unlimited && r.max > 0),
      ),
    );
    // 통화별 허용 소수점에 맞춰 입력값을 정리 (예: USD 150.5 -> KRW 151)
    setForm((prev) => ({
      ...prev,
      amountRanges: prev.amountRanges.map((r) => ({
        ...r,
        min: roundToCurrency(r.min, currency),
        max: roundToCurrency(r.max, currency),
      })),
    }));
  }, [currency, mode]);

  // 테스트 장바구니는 기본 제품 없이 빈 상태로 시작 (검색으로 담기)
  const [cart, setCart] = useState<Record<string, number>>({});
  // Option Select 시뮬레이터에서 고객이 고를 Reward 제품
  const [simRewardChoice, setSimRewardChoice] = useState("");
  const [simSearch, setSimSearch] = useState("");
  useEffect(() => {
    const ids = new Set([
      ...form.rewardProducts.map((p) => p.id),
      ...Object.values(form.rangeRewards)
        .flat()
        .map((p) => p.id),
    ]);
    setSimRewardChoice((prev) => (ids.has(prev) ? prev : ""));
  }, [form.rewardProducts, form.rangeRewards]);

  const patch = (p: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...p }));

  const isGwp = form.promoType === "gwp";
  const isPkg = form.promoType === "package";
  // Option Select 증정은 고객에게 노출할 Reward 제품을 최대 10개까지만 등록 가능
  const isOptionGive =
    form.condMode !== "allProducts" && form.rewardGive === "option";
  const rewardLimit = isOptionGive ? OPTION_REWARD_MAX : Infinity;

  const invOf = (id: string) =>
    form.inventory[id] ?? { total: 0, sold: 0, alert: 0 };

  const targetMatches = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          !form.targets.some((t) => t.id === p.id) &&
          matchProduct(p, targetField, targetQuery),
      ),
    [form.targets, targetQuery, targetField],
  );
  const excludeMatches = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          !form.excludeTargets.some((t) => t.id === p.id) &&
          matchProduct(p, excludeField, excludeQuery),
      ),
    [form.excludeTargets, excludeQuery, excludeField],
  );
  const rewardMatches = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          !form.rewardProducts.some((t) => t.id === p.id) &&
          (!isPkg || p.category === "Package") &&
          matchProduct(p, rewardField, rewardQuery),
      ),
    [form.rewardProducts, rewardQuery, rewardField, isPkg],
  );

  // ---- mutations ----
  const setPromoType = (v: PromoType) => {
    setForm((prev) => {
      const next = { ...prev, promoType: v };
      if (v === "package") {
        // Packaging Benefit 은 Reward Basis 가 Per product quantity 로 고정되고
        // Target = Order Amount 를 사용할 수 없다 (Order Amount 였다면 Specific Product 로 전환)
        next.rewardBasis = "product";
        if (prev.condMode === "amount") next.condMode = "products";
      }
      if (v === "gwp") {
        // GWP는 단일 채널만 유지 (현재 켜진 채널 중 첫 번째)
        const keep = availableChannels.filter((n) => prev.channels[n])[0];
        const channels: Record<string, boolean> = {};
        if (keep) channels[keep] = true;
        next.channels = channels;
      }
      return next;
    });
  };
  const selectChannel = (name: string) => {
    const nextChannels =
      form.promoType === "gwp"
        ? { [name]: true }
        : { ...form.channels, [name]: !form.channels[name] };
    // Option Select 증정 진행 중 자사몰(Official)이 아닌 채널로 변경되면 안내 후 기본 증정으로 초기화
    if (form.rewardGive === "option") {
      const selected = availableChannels.filter((c) => nextChannels[c]);
      const invalid =
        selected.length === 0 || selected.some((c) => !c.includes("Official"));
      if (invalid) {
        setForm((prev) => ({
          ...prev,
          channels: nextChannels,
          rewardGive: "default",
        }));
        setDialog("optionChannelInvalid");
        return;
      }
    }
    setForm((prev) => ({ ...prev, channels: nextChannels }));
  };
  const addToList = (
    key: "targets" | "excludeTargets" | "rewardProducts",
    p: Product,
  ) =>
    setForm((prev) => {
      const item = {
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
      };
      const next = { ...prev, [key]: [...prev[key], item] };
      if (key === "rewardProducts" && !prev.inventory[p.id]) {
        next.inventory = {
          ...prev.inventory,
          [p.id]: { total: 0, sold: 0, alert: 0 },
        };
      }
      return next;
    });
  const addAll = (
    key: "targets" | "excludeTargets" | "rewardProducts",
    list: Product[],
  ) =>
    setForm((prev) => {
      const items = list.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
      }));
      const inventory = { ...prev.inventory };
      if (key === "rewardProducts")
        list.forEach((p) => {
          if (!inventory[p.id])
            inventory[p.id] = { total: 0, sold: 0, alert: 0 };
        });
      return { ...prev, [key]: [...prev[key], ...items], inventory };
    });
  const removeAt = (
    key: "targets" | "excludeTargets" | "rewardProducts",
    i: number,
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, idx) => idx !== i),
    }));
  const clearList = (key: "targets" | "excludeTargets" | "rewardProducts") =>
    setForm((prev) => ({ ...prev, [key]: [] }));
  const setInv = (id: string, field: keyof Inventory, value: number) =>
    setForm((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [id]: {
          ...(prev.inventory[id] ?? { total: 0, sold: 0, alert: 0 }),
          [field]: Math.max(0, value),
        },
      },
    }));
  // ---- Order Amount 구간 mutations ----
  // 구간 사이에 공백/중복이 생기지 않도록 이웃 구간의 경계값을 함께 맞춘다
  const patchRange = (idx: number, p: Partial<AmountRange>) => {
    setCurrencyChanged(false); // 사용자가 구간을 다시 손대면 통화 변경 안내 해제
    setForm((prev) => {
      const ranges = prev.amountRanges.map((r, i) =>
        i === idx ? { ...r, ...p } : r,
      );
      if (p.max !== undefined && ranges[idx + 1])
        ranges[idx + 1] = { ...ranges[idx + 1], min: p.max };
      if (p.min !== undefined && idx > 0)
        ranges[idx - 1] = { ...ranges[idx - 1], max: p.min };
      return { ...prev, amountRanges: ranges };
    });
  };

  const addRange = () =>
    setForm((prev) => {
      if (prev.amountRanges.length >= MAX_AMOUNT_RANGES) return prev;
      const lastIdx = prev.amountRanges.length - 1;
      const last = prev.amountRanges[lastIdx];
      // 무제한은 마지막 구간만 가질 수 있으므로 새로 추가된 구간으로 넘긴다
      const boundary = last.unlimited ? last.min : last.max;
      const ranges = prev.amountRanges.map((r, i) =>
        i === lastIdx ? { ...r, unlimited: false, max: boundary } : r,
      );
      return {
        ...prev,
        amountRanges: [...ranges, makeRange(boundary, 0, last.unlimited)],
      };
    });

  const removeRange = (idx: number) =>
    setForm((prev) => {
      if (prev.amountRanges.length <= 1) return prev;
      const removed = prev.amountRanges[idx];
      const ranges = prev.amountRanges.filter((_, i) => i !== idx);
      // 삭제된 자리를 기준으로 앞뒤 구간을 다시 이어 붙인다
      if (idx === 0) ranges[0] = { ...ranges[0], min: removed.min };
      else if (ranges[idx])
        ranges[idx] = { ...ranges[idx], min: ranges[idx - 1].max };
      if (removed.unlimited)
        ranges[ranges.length - 1] = {
          ...ranges[ranges.length - 1],
          unlimited: true,
        };
      const rangeRewards = { ...prev.rangeRewards };
      delete rangeRewards[removed.id];
      const inventory: Record<string, Inventory> = {};
      Object.entries(prev.inventory).forEach(([k, v]) => {
        if (!k.startsWith(`${removed.id}::`)) inventory[k] = v;
      });
      return { ...prev, amountRanges: ranges, rangeRewards, inventory };
    });

  // 무제한(상한 없음)은 마지막 구간에서만 토글 가능
  const toggleLastUnlimited = () =>
    setForm((prev) => {
      const lastIdx = prev.amountRanges.length - 1;
      return {
        ...prev,
        amountRanges: prev.amountRanges.map((r, i) =>
          i === lastIdx ? { ...r, unlimited: !r.unlimited } : r,
        ),
      };
    });

  // ---- Reward 제품 mutations (rangeId 를 주면 해당 금액 구간에만 적용) ----
  const withRewardInv = (
    prev: FormState,
    items: SelectedProduct[],
    rangeId?: string,
  ) => {
    const inventory = { ...prev.inventory };
    items.forEach((it) => {
      const key = invKeyOf(it.id, rangeId);
      if (!inventory[key]) inventory[key] = { total: 0, sold: 0, alert: 0 };
    });
    return inventory;
  };
  const toSelected = (p: Product): SelectedProduct => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
  });
  const addRewardAll = (list: Product[], rangeId?: string) =>
    setForm((prev) => {
      const items = list.map(toSelected);
      const inventory = withRewardInv(prev, items, rangeId);
      if (!rangeId)
        return {
          ...prev,
          rewardProducts: [...prev.rewardProducts, ...items],
          inventory,
        };
      return {
        ...prev,
        rangeRewards: {
          ...prev.rangeRewards,
          [rangeId]: [...(prev.rangeRewards[rangeId] ?? []), ...items],
        },
        inventory,
      };
    });
  const addReward = (p: Product, rangeId?: string) =>
    addRewardAll([p], rangeId);
  const removeRewardAt = (i: number, rangeId?: string) =>
    setForm((prev) => {
      if (!rangeId)
        return {
          ...prev,
          rewardProducts: prev.rewardProducts.filter((_, idx) => idx !== i),
        };
      return {
        ...prev,
        rangeRewards: {
          ...prev.rangeRewards,
          [rangeId]: (prev.rangeRewards[rangeId] ?? []).filter(
            (_, idx) => idx !== i,
          ),
        },
      };
    });
  const clearRewards = (rangeId?: string) =>
    setForm((prev) =>
      rangeId
        ? { ...prev, rangeRewards: { ...prev.rangeRewards, [rangeId]: [] } }
        : { ...prev, rewardProducts: [] },
    );

  const cartAdd = (id: string, d: number) =>
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + d) }));

  const per = computePeriod(form);

  // Promotion Status 필드 / 기간 박스 상태 칩 공통 색상
  const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
    Active: { color: SUCCESS, bg: SUCCESS_BG },
    Scheduled: { color: WARNING, bg: WARNING_BG },
    Ended: { color: TEXT_TERTIARY, bg: SURFACE_SUNKEN },
    Draft: { color: BRAND, bg: BRAND_SOFT },
    Deleted: { color: "#FFFFFF", bg: DANGER },
  };

  // ---- simulation ----
  const sim = useMemo(() => {
    // 테스트 장바구니: 검색으로 담은 제품(수량 1 이상)만 노출
    const cartCatalog = PRODUCTS.filter((p) => (cart[p.id] || 0) > 0);
    let cartTotal = 0;
    cartCatalog.forEach((p) => (cartTotal += (cart[p.id] || 0) * p.price));
    const enabled = !!form.channels[simChannel];
    const chName = simChannel || "No channel";
    const bq = Math.max(1, form.buyQty || 1);
    const excludeIds = form.excludeTargets.map((t) => t.id);
    const checks: {
      ok: boolean;
      warn?: boolean;
      label: string;
      detail: string;
    }[] = [];
    checks.push({
      ok: enabled,
      label: "Channel exposure",
      detail: enabled ? `${chName} active` : `Inactive on ${chName}`,
    });
    let condMet = false;
    let rewardMult = 1;
    // Order Amount: 장바구니 금액이 속한 구간 index (없으면 -1)
    let matchedRangeIdx = -1;
    if (form.condMode === "products") {
      const present = form.targets.filter((t) => (cart[t.id] || 0) >= bq);
      const ok =
        form.productMatch === "all"
          ? form.targets.length > 0 && present.length === form.targets.length
          : present.length > 0;
      condMet = ok;
      const qq = present.reduce((s, t) => s + (cart[t.id] || 0), 0);
      rewardMult = ok && form.rewardBasis === "product" ? Math.max(1, qq) : 1;
      checks.push({
        ok,
        label: "Target product condition",
        detail: `${form.productMatch === "all" ? "All items" : "Any item"} (each ≥ ${bq}): ${present.length} / ${form.targets.length} met`,
      });
    } else if (form.condMode === "amount") {
      // 주문 금액이 속한 구간을 찾아 그 구간의 Reward 만 적용한다
      matchedRangeIdx = form.amountRanges.findIndex(
        (r) => cartTotal >= r.min && (r.unlimited || cartTotal < r.max),
      );
      condMet = matchedRangeIdx >= 0;
      checks.push({
        ok: condMet,
        label: "Order amount condition",
        detail: condMet
          ? `${won(cartTotal)} → Range ${matchedRangeIdx + 1} (${rangeText(form.amountRanges[matchedRangeIdx], currency)})`
          : `${won(cartTotal)} does not fall into any range`,
      });
    } else if (form.condMode === "allProducts") {
      const qualifying = cartCatalog.filter(
        (p) => (cart[p.id] || 0) > 0 && !excludeIds.includes(p.id),
      );
      condMet = qualifying.length > 0;
      // Reward Basis 가 Per product quantity 면 대상 제품 수량만큼 증정
      const qq = qualifying.reduce((sum, p) => sum + (cart[p.id] || 0), 0);
      rewardMult =
        condMet && form.rewardBasis === "product" ? Math.max(1, qq) : 1;
      const excl = cartCatalog.filter(
        (p) => (cart[p.id] || 0) > 0 && excludeIds.includes(p.id),
      ).length;
      checks.push({
        ok: condMet,
        label: "All products condition",
        detail: `${qualifying.length} eligible item(s) in cart${excl ? ` · ${excl} excluded` : ""}`,
      });
    }
    const applied = enabled && condMet;
    // 증정 방식 (Specific Product / Order Amount 일 때만 Option Select 적용)
    const give: RewardGive =
      form.condMode === "allProducts" ? "default" : form.rewardGive;
    // Order Amount 면 매칭된 구간의 Reward 목록, 아니면 전체 Reward 목록
    const simRangeId =
      form.condMode === "amount" && matchedRangeIdx >= 0
        ? form.amountRanges[matchedRangeIdx].id
        : undefined;
    const rewardChoices: SelectedProduct[] =
      form.condMode === "amount"
        ? simRangeId
          ? (form.rangeRewards[simRangeId] ?? [])
          : []
        : form.rewardProducts;
    const rewards: {
      icon: "gift" | "package";
      title: string;
      detail: string;
    }[] = [];
    // 증정되는 상품은 Reward 영역 제품 기준. 선택 정보에 따라 다르게 표시.
    const rewardDetailOf = (id: string) => {
      const inv = invOf(invKeyOf(id, simRangeId));
      const remain = Math.max(0, inv.total - inv.sold);
      return isPkg
        ? `Given without quantity limit${rewardMult > 1 ? ` · ${rewardMult}` : ""}`
        : `${remain} left · ${rewardMult > 1 ? `${rewardMult} given` : "1 given"}`;
    };
    if (applied) {
      if (give === "option") {
        // 고객이 Select Reward에서 고른 제품 1개만 증정
        const chosen =
          rewardChoices.find((p) => p.id === simRewardChoice) ??
          rewardChoices[0];
        if (chosen)
          rewards.push({
            icon: isPkg ? "package" : "gift",
            title: chosen.name,
            detail: `Customer's choice · ${rewardDetailOf(chosen.id)}`,
          });
      } else {
        rewardChoices.forEach((t) =>
          rewards.push({
            icon: isPkg ? "package" : "gift",
            title: t.name,
            detail: rewardDetailOf(t.id),
          }),
        );
      }
    }
    if (applied && rewards.length === 0)
      checks.push({
        ok: false,
        warn: true,
        label: "No reward to apply",
        detail: "Please add a reward product",
      });
    return {
      cartTotal,
      catalog: cartCatalog,
      enabled,
      chName,
      checks,
      applied,
      rewards,
      rewardChoices,
      matchedRangeIdx,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, cart, simChannel, isPkg, simRewardChoice]);

  const effGoal =
    form.goal === "__custom__" ? form.goalCustom || "Custom" : form.goal;
  const enabledCh = availableChannels.filter((n) => form.channels[n]);

  let condText: string;
  if (form.condMode === "amount")
    condText = form.amountRanges
      .map((r, i) => `Range ${i + 1} ${rangeText(r, currency)}`)
      .join(" / ");
  else if (form.condMode === "allProducts")
    condText = `All products${form.excludeTargets.length ? ` (excl. ${form.excludeTargets.length})` : ""}`;
  else {
    const names = form.targets.map((t) => t.name);
    condText = names.length
      ? names.join(form.productMatch === "all" ? " + " : " or ")
      : "No product selected";
  }
  // 증정 방식 라벨 (Specific Product / Order Amount 전용)
  const giveLabel =
    form.condMode !== "allProducts" && form.rewardGive === "option"
      ? "Option Select"
      : "";

  // Summary 항목 (우측 카드 / 저장 확인 다이얼로그 공용)
  const summaryRows: [string, string][] = [
    ["Type", isGwp ? "GWP · Free Gift" : "Packaging Benefit"],
    ["Goal", effGoal],
    [
      "Period",
      form.always
        ? `${form.start ? fmtDate(parseDate(form.start)) : "-"} ~ Always`
        : `${form.start ? fmtDate(parseDate(form.start)) : "-"} ~ ${form.end ? fmtDate(parseDate(form.end)) : "-"}`,
    ],
    [
      "Channel",
      enabledCh.length ? enabledCh.join(", ") : "No channel selected",
    ],
    ["Target", condText],
    ...(giveLabel ? ([["Reward Type", giveLabel]] as [string, string][]) : []),
    // Reward Basis 는 Specific Product / All Products 에서 설정 가능
    ...(form.condMode !== "amount"
      ? ([
          [
            "Reward Basis",
            form.rewardBasis === "product"
              ? "Per product quantity"
              : "Per order",
          ],
        ] as [string, string][])
      : []),
  ];

  // Summary 에 노출할 Reward 제품 목록 (Order Amount 면 구간 라벨을 붙인다)
  const summaryRewards: { key: string; label: string; color: string }[] =
    form.condMode === "amount"
      ? form.amountRanges.flatMap((r, i) =>
          (form.rangeRewards[r.id] ?? []).map((t) => ({
            key: `${r.id}:${t.id}`,
            label: `R${i + 1} · ${t.name}`,
            color: rangeColor(i),
          })),
        )
      : form.rewardProducts.map((t) => ({
          key: t.id,
          label: t.name,
          color: BRAND,
        }));

  // 시뮬레이터 장바구니 담기용 검색 결과 (이미 담긴 제품 제외)
  const simSearchResults = useMemo(() => {
    const q = simSearch.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        !((cart[p.id] || 0) > 0) &&
        (p.name.toLowerCase().includes(q) || p.sap.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [simSearch, cart]);

  const goBack = () => router.push("/promotion/promotion-list");

  // 다이얼로그 상태
  const [dialog, setDialog] = useState<
    | null
    | "save"
    | "draft"
    | "cancel"
    | "invalid"
    | "delete"
    | "forceStop"
    | "optionRestricted"
    | "optionTemplateNoOfficial"
    | "optionChannelInvalid"
    | "optionMaxReached"
  >(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  // 저장 시 Summary 를 한 번 더 확인하도록 포커싱(스크롤 + 강조)
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryFocused, setSummaryFocused] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<HTMLElement | null>(
    null,
  );

  // ---- Promotion Template 연동 ----
  // 템플릿 불러오기는 신규 등록 또는 Draft 상태에서만 가능
  const canLoadTemplate = mode === "add" || status === "Draft";
  const openSnackbar = useSnackbarStore((s) => s.openSnackbar);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [saveAsTemplateOpen, setSaveAsTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // 템플릿 불러오기: Basic Info · Target · Reward 만 교체하고 Period · Channel · Status 는 유지
  const applyTemplate = (t: PromotionTemplate) => {
    const b = templateToBridge(t);
    // Packaging Benefit 템플릿: Reward Basis 는 Per product quantity 고정, Order Amount 는 Specific Product 로 전환
    if (b.promoType === "package") {
      b.rewardBasis = "product";
      if (b.condMode === "amount") b.condMode = "products";
    }
    // Option Select 템플릿은 자사몰(Official) 채널이 있어야 적용 가능 — 없으면 적용하지 않고 안내
    if (
      b.rewardGive === "option" &&
      !availableChannels.some((c) => c.toLowerCase().includes("official"))
    ) {
      setTemplatePickerOpen(false);
      setDialog("optionTemplateNoOfficial");
      return;
    }
    setForm((prev) => {
      const inventory: Record<string, Inventory> = { ...prev.inventory };
      const range = makeRange(b.minAmount, 0, true);
      const rangeRewards: Record<string, SelectedProduct[]> = {};
      if (b.condMode === "amount") {
        rangeRewards[range.id] = b.rewardProducts;
        b.rewardProducts.forEach((p) => {
          const key = invKeyOf(p.id, range.id);
          if (!inventory[key]) inventory[key] = { total: 0, sold: 0, alert: 0 };
        });
      } else {
        b.rewardProducts.forEach((p) => {
          if (!inventory[p.id])
            inventory[p.id] = { total: 0, sold: 0, alert: 0 };
        });
      }
      const knownGoal = GOALS.includes(b.goal);
      // Option Select 템플릿은 판매 채널을 자사몰(Official) 채널로 자동 설정
      // — 사용 가능한 Official 채널 중 최상단 1개만 선택. Official 채널이 없으면 기본 증정으로 내린다
      const firstOfficial = availableChannels.find((c) =>
        c.toLowerCase().includes("official"),
      );
      const applyOption = b.rewardGive === "option" && !!firstOfficial;
      const channels = applyOption
        ? { [firstOfficial as string]: true }
        : prev.channels;
      return {
        ...prev,
        channels,
        name: b.name,
        goal: knownGoal ? b.goal : "__custom__",
        goalCustom: knownGoal ? "" : b.goal,
        promoType: b.promoType,
        condMode: b.condMode,
        productMatch: b.productMatch,
        buyQty: b.buyQty,
        rewardBasis: b.rewardBasis,
        rewardGive:
          b.rewardGive === "option" && !applyOption ? "default" : b.rewardGive,
        targets: b.condMode === "products" ? b.targets : [],
        excludeTargets: [],
        rewardProducts: b.condMode === "amount" ? [] : b.rewardProducts,
        amountRanges: b.condMode === "amount" ? [range] : prev.amountRanges,
        rangeRewards:
          b.condMode === "amount" ? rangeRewards : prev.rangeRewards,
        inventory,
      };
    });
    setTemplatePickerOpen(false);
    openSnackbar({
      message:
        t.rewardType === "option"
          ? `Template "${t.name}" loaded. Sales channel was set to the Official channel (Option Select). Set the period, then save.`
          : `Template "${t.name}" loaded. Set the period and sales channel, then save.`,
      severity: "success",
    });
  };

  // 현재 입력값을 템플릿으로 등록 (같은 이름의 템플릿이 있어도 중복 등록 가능)
  const currentBridge = (): TemplateFormBridge => {
    const amountRewards = form.amountRanges.flatMap(
      (r) => form.rangeRewards[r.id] ?? [],
    );
    const dedupe = (list: SelectedProduct[]) =>
      list.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
    return {
      name: form.name,
      goal: form.goal === "__custom__" ? form.goalCustom : form.goal,
      promoType: form.promoType,
      condMode: form.condMode,
      productMatch: form.productMatch,
      buyQty: form.buyQty,
      rewardBasis: form.rewardBasis,
      rewardGive: form.rewardGive,
      minAmount: form.amountRanges[0]?.min ?? 0,
      targets: form.targets,
      rewardProducts: dedupe(
        form.condMode === "amount" ? amountRewards : form.rewardProducts,
      ),
    };
  };
  const openSaveAsTemplate = () => {
    setTemplateName(form.name.trim());
    setSaveAsTemplateOpen(true);
  };
  const handleSaveAsTemplate = () => {
    const draft = bridgeToDraft(currentBridge(), templateName || form.name);
    if (!draft.name) return;
    const t = createTemplate(draft);
    setSaveAsTemplateOpen(false);
    openSnackbar({
      message: `Saved as template "${t.name}". Find it under Promotion › Template.`,
      severity: "success",
    });
  };

  // 필수값 검증 (화면에 노출되는 항목은 모두 필수)
  const collectMissing = (): string[] => {
    const m: string[] = [];
    if (!form.name.trim()) m.push("Promotion Name");
    if (form.goal === "__custom__" && !form.goalCustom.trim())
      m.push("Promotion Goal");
    if (!form.start) m.push("Start Date");
    if (!form.always && !form.end) m.push("End Date");
    // 종료일은 시작일보다 이후여야 한다 (직접 입력으로 min 제약을 우회한 경우 차단)
    if (
      !form.always &&
      form.start &&
      form.end &&
      parseDate(form.end).getTime() <= parseDate(form.start).getTime()
    )
      m.push("End Date (must be later than Start Date)");
    if (!availableChannels.some((c) => form.channels[c]))
      m.push("Sales Channel");

    if (form.condMode === "products") {
      if (form.targets.length === 0) m.push("Target Product");
      if (
        !form.buyQty ||
        form.buyQty < BUY_QTY_MIN ||
        form.buyQty > BUY_QTY_MAX
      )
        m.push("Purchase Quantity");
    } else if (form.condMode === "amount") {
      form.amountRanges.forEach((r, i) => {
        const label = `Range ${i + 1}`;
        if (i === 0 && !r.min) m.push(`Order Amount (${label} lower bound)`);
        if (!r.unlimited && r.max <= r.min)
          m.push(`Order Amount (${label} upper bound)`);
        if (i > 0 && r.min !== form.amountRanges[i - 1].max)
          m.push(`Order Amount (${label} must start where Range ${i} ends)`);
      });
    }

    if (form.condMode === "amount") {
      // 구간마다 Reward 제품과 재고를 각각 입력해야 한다
      form.amountRanges.forEach((r, i) => {
        const list = form.rangeRewards[r.id] ?? [];
        if (list.length === 0) {
          m.push(`Reward Product (Range ${i + 1})`);
          return;
        }
        if (!isGwp) return;
        list.forEach((pd) => {
          const inv = invOf(invKeyOf(pd.id, r.id));
          if (!inv.total) m.push(`Reward Total (Range ${i + 1} · ${pd.name})`);
          if (!inv.alert) m.push(`Reward Alert (Range ${i + 1} · ${pd.name})`);
        });
      });
    } else {
      if (form.rewardProducts.length === 0) m.push("Reward Product");
      if (isGwp) {
        form.rewardProducts.forEach((pd) => {
          const inv = invOf(pd.id);
          if (!inv.total) m.push(`Reward Total (${pd.name})`);
          if (!inv.alert) m.push(`Reward Alert (${pd.name})`);
        });
      }
    }
    return m;
  };

  // All Products 는 증정 방식을 사용하지 않으므로 기본 증정으로 초기화
  const handleCondMode = (v: CondMode) =>
    patch(
      v === "allProducts"
        ? { condMode: v, rewardGive: "default" }
        : { condMode: v },
    );

  // Option Select 증정 방식은 채널명에 "Official"이 포함된 채널(자사몰)에서만 사용 가능
  const handleRewardGive = (v: RewardGive) => {
    if (v === "option") {
      const selected = availableChannels.filter((c) => form.channels[c]);
      const hasNonOfficial = selected.some((c) => !c.includes("Official"));
      if (selected.length === 0 || hasNonOfficial) {
        setDialog("optionRestricted");
        return;
      }
      // 이미 담은 Reward 제품이 제한 개수를 넘으면 전환 불가 (구간별 목록 포함)
      const maxSelected = Math.max(
        form.rewardProducts.length,
        ...Object.values(form.rangeRewards).map((l) => l.length),
        0,
      );
      if (maxSelected > OPTION_REWARD_MAX) {
        setDialog("optionMaxReached");
        return;
      }
    }
    patch({ rewardGive: v });
  };

  const handleSaveClick = () => {
    const missing = collectMissing();
    if (missing.length > 0) {
      setMissingFields(missing);
      setDialog("invalid");
      return;
    }
    // 저장 전 Summary 로 스크롤 · 강조 후 확인 다이얼로그 노출
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSummaryFocused(true);
    window.setTimeout(() => setDialog("save"), 450);
  };

  const closeSaveDialog = () => {
    setDialog(null);
    setSummaryFocused(false);
  };

  return (
    <Box sx={{ background: "#F5F5F5", minHeight: "100%", p: "32px" }}>
      <Box sx={{ maxWidth: 1240, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: BRAND,
                fontWeight: 600,
                mb: 0.75,
              }}
            >
              {mode === "edit" ? "Edit Promotion" : "New Promotion"}
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>
              {mode === "edit" ? "Edit Promotion" : "Create Promotion"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.25, pt: 1 }}>
            {canLoadTemplate && (
              <Button
                variant="outlined"
                onClick={() => setTemplatePickerOpen(true)}
                sx={{ height: 46, textTransform: "none", fontWeight: 600 }}
              >
                Load Template
              </Button>
            )}
            {!readOnly && (
              <Button
                variant="outlined"
                onClick={openSaveAsTemplate}
                sx={{ height: 46, textTransform: "none", fontWeight: 600 }}
              >
                Save as Template
              </Button>
            )}
            <Button
              variant="contained"
              onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
              endIcon={<ExpandMoreIcon />}
              sx={{ height: 46, textTransform: "none", fontWeight: 600 }}
            >
              Change Status
            </Button>
            <Menu
              anchorEl={statusMenuAnchor}
              open={!!statusMenuAnchor}
              onClose={() => setStatusMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                disabled={!canSave}
                onClick={() => {
                  setStatusMenuAnchor(null);
                  handleSaveClick();
                }}
              >
                Save
              </MenuItem>
              <MenuItem
                disabled={!canSaveDraft}
                onClick={() => {
                  setStatusMenuAnchor(null);
                  setDialog("draft");
                }}
              >
                Draft
              </MenuItem>
              <MenuItem
                disabled={!canDelete}
                onClick={() => {
                  setStatusMenuAnchor(null);
                  setDeleteConfirmText("");
                  setDialog("delete");
                }}
                sx={{ color: DANGER }}
              >
                Delete
              </MenuItem>
              <MenuItem
                disabled={!canForceStop}
                onClick={() => {
                  setStatusMenuAnchor(null);
                  setDialog("forceStop");
                }}
                sx={{ color: DANGER }}
              >
                Force Stop
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 360px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.75,
              minWidth: 0,
            }}
          >
            {/* Section 1 */}
            <SectionCard num="1" title="Basic Info · Period">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  <FieldLabel>Promotion Status</FieldLabel>
                  {mode === "edit" ? (
                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        height: 28,
                        borderRadius: "999px",
                        background: STATUS_STYLE[status].bg,
                        color: STATUS_STYLE[status].color,
                        fontSize: 13,
                        fontWeight: 600,
                        px: 0.5,
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{ fontSize: 14, color: TEXT_TERTIARY, py: 0.5 }}
                    >
                      -
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  <FieldLabel>Promotion Name</FieldLabel>
                  <TextField
                    value={form.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder="e.g. Holiday Perfume Gift GWP"
                    fullWidth
                    disabled={locked}
                    sx={inputSx}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  <FieldLabel>Promotion Type</FieldLabel>
                  <Segmented
                    value={form.promoType}
                    onChange={setPromoType}
                    disabled={locked}
                    options={[
                      { value: "gwp", label: "GWP · Free Gift" },
                      { value: "package", label: "Packaging Benefit" },
                    ]}
                  />
                  <Typography sx={{ fontSize: 12, color: TEXT_TERTIARY }}>
                    {isGwp
                      ? "GWP applies to a single channel only. You can also manage reward product quantity."
                      : "Packaging Benefit can apply to multiple channels, and rewards can only be Package-category products."}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  <FieldLabel>Promotion Goal</FieldLabel>
                  <Select
                    value={form.goal}
                    onChange={(e) => patch({ goal: e.target.value })}
                    disabled={locked}
                    sx={{
                      height: 48,
                      borderRadius: "10px",
                      fontSize: 14,
                      background: "#fff",
                      "& fieldset": {
                        borderColor: BORDER,
                        borderWidth: "1.5px",
                      },
                    }}
                  >
                    {GOALS.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                    <MenuItem value="__custom__">Custom</MenuItem>
                  </Select>
                  {form.goal === "__custom__" && (
                    <TextField
                      value={form.goalCustom}
                      onChange={(e) => patch({ goalCustom: e.target.value })}
                      placeholder="Enter a custom promotion goal"
                      fullWidth
                      disabled={locked}
                      sx={{
                        ...inputSx,
                        "& .MuiOutlinedInput-root": {
                          ...inputSx["& .MuiOutlinedInput-root"],
                          background: BRAND_SOFT,
                          "& fieldset": {
                            borderColor: BRAND,
                            borderWidth: "1.5px",
                          },
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                  >
                    <FieldLabel>Start Date</FieldLabel>
                    <TextField
                      type="datetime-local"
                      value={form.start}
                      onChange={(e) => patch({ start: e.target.value })}
                      fullWidth
                      disabled={locked}
                      // 과거 시각 선택 불가 · 시(hour) 단위 선택 · AM/PM 표기(en-US)
                      inputProps={{
                        min: nowLocal(),
                        step: 3600,
                        lang: "en-US",
                      }}
                      sx={inputSx}
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                  >
                    <FieldLabel>End Date</FieldLabel>
                    <TextField
                      type="datetime-local"
                      value={form.end}
                      onChange={(e) => patch({ end: e.target.value })}
                      // 진행 중(Active)인 프로모션도 종료일은 수정 가능
                      disabled={form.always || endDateLocked}
                      fullWidth
                      // 진행 중이면 현재 시각 이후, 그 외에는 시작 시각 이후만
                      // 시(hour) 단위 · AM/PM 표기(en-US)
                      inputProps={{
                        min: locked ? nowLocal() : form.start || nowLocal(),
                        step: 3600,
                        lang: "en-US",
                      }}
                      sx={inputSx}
                    />
                    {locked && !endDateLocked && (
                      <Typography sx={{ fontSize: 12, color: BRAND }}>
                        The promotion is running. Only the end date can be
                        changed.
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  onClick={() => !locked && patch({ always: !form.always })}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: locked ? "default" : "pointer",
                    fontSize: 14,
                    color: locked ? TEXT_TERTIARY : TEXT_PRIMARY,
                  }}
                >
                  <Switch checked={form.always} disabled={locked} />
                  Always on (no end date)
                </Box>
                {/* Period box */}
                <Box
                  sx={{
                    p: "18px 20px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "10px",
                    background: SURFACE_ALT,
                  }}
                >
                  {/* 상태 칩 제거: 이 박스는 입력한 날짜만으로 계산한 참고 정보이며
                      실제 Promotion Status 와는 무관하다는 점을 문구로 안내한다. */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      mb: 1.25,
                      color: TEXT_SECONDARY,
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.2 }}
                    >
                      Date preview · calculated from the dates above, not the
                      actual promotion status
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {per.dday}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: TEXT_SECONDARY,
                        fontWeight: 500,
                      }}
                    >
                      {per.durationLabel}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={per.pct}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      background: "#E6E6E6",
                      "& .MuiLinearProgress-bar": {
                        background: BORDER_STRONG,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1.25,
                      fontSize: 12,
                      color: TEXT_TERTIARY,
                    }}
                  >
                    <span>{per.startLabel}</span>
                    <Box component="span" sx={{ color: TEXT_SECONDARY }}>
                      Today {per.todayLabel}
                    </Box>
                    <span>{per.endLabel}</span>
                  </Box>
                </Box>
              </Box>
            </SectionCard>

            {/* Section 2 - Channels */}
            <SectionCard
              num="2"
              title="Sales Channel"
              desc={
                isGwp
                  ? "GWP applies to a single channel only. (single select)"
                  : "Select channels to expose the promotion. Multiple selections allowed. (multi select)"
              }
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {availableChannels.length === 0 && (
                  <EmptyHint text="No channels available for the selected Brand & Corp." />
                )}
                {availableChannels.map((name) => {
                  const on = !!form.channels[name];
                  return (
                    <Box
                      key={name}
                      onClick={() => !locked && selectChannel(name)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.75,
                        p: "16px 18px",
                        border: `1px solid ${on ? BRAND : BORDER}`,
                        background: on ? BRAND_SOFT : "#fff",
                        borderRadius: "10px",
                        cursor: locked ? "default" : "pointer",
                        opacity: locked && !on ? 0.6 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          flex: "none",
                          borderRadius: isGwp ? "50%" : "4px",
                          border: `1.5px solid ${on ? BRAND : BORDER_STRONG}`,
                          background: on ? BRAND : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {on &&
                          (isGwp ? (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#fff",
                              }}
                            />
                          ) : (
                            <CheckCircleIcon
                              sx={{ fontSize: 14, color: "#fff" }}
                            />
                          ))}
                      </Box>
                      <Typography
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: on ? TEXT_PRIMARY : TEXT_SECONDARY,
                        }}
                      >
                        {name}
                      </Typography>
                      {on && (
                        <Chip
                          label="Applied"
                          size="small"
                          sx={{
                            height: 22,
                            background: BRAND_TINT,
                            color: BRAND_STRONG,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </SectionCard>

            {/* Section 3 - Target */}
            <SectionCard num="3" title="Target">
              <Box sx={{ mb: 2.75 }}>
                <Segmented
                  value={form.condMode}
                  onChange={handleCondMode}
                  disabled={locked}
                  options={[
                    { value: "products", label: "Specific Product" },
                    // Packaging Benefit 은 Order Amount 조건을 사용할 수 없다
                    { value: "amount", label: "Order Amount", disabled: isPkg },
                    { value: "allProducts", label: "All Products" },
                  ]}
                />
                {isPkg && (
                  <Typography
                    sx={{ fontSize: 12, color: TEXT_TERTIARY, mt: 0.75 }}
                  >
                    Order Amount is not available for Packaging Benefit.
                  </Typography>
                )}
              </Box>
              {renderCondition()}
            </SectionCard>

            {/* Section 4 - Reward */}
            <SectionCard
              num="4"
              title="Reward · Benefit"
              desc={
                form.condMode === "amount"
                  ? "Reward type applies to the whole promotion. Reward products are set per order amount range."
                  : isPkg
                    ? "Add reward products regardless of the condition. Packaging Benefit can only select Package-category products and is given without any quantity limit during the promotion period."
                    : "Add reward products regardless of the condition. GWP manages total/sold/alert quantity per reward product."
              }
            >
              {renderReward()}
            </SectionCard>
          </Box>

          {/* RIGHT ASIDE */}
          <Box
            sx={{
              position: { md: "sticky" },
              top: 96,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Summary dark card */}
            <Box
              ref={summaryRef}
              sx={{
                background: "#1E293B",
                borderRadius: "12px",
                p: "24px",
                color: "#fff",
                scrollMarginTop: "96px",
                transition: "box-shadow .25s ease",
                boxShadow: summaryFocused
                  ? `0 0 0 3px ${BRAND}, 0 8px 24px rgba(25,118,210,.35)`
                  : "none",
                animation: summaryFocused
                  ? "summaryFocusPulse 1.4s ease-in-out infinite"
                  : "none",
                "@keyframes summaryFocusPulse": {
                  "0%, 100%": { boxShadow: `0 0 0 3px ${BRAND}` },
                  "50%": { boxShadow: `0 0 0 7px rgba(25,118,210,.28)` },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  fontWeight: 600,
                  mb: 1.75,
                }}
              >
                Summary
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  mb: 2.25,
                  lineHeight: 1.3,
                }}
              >
                {form.name || "New Promotion"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  fontSize: 13,
                }}
              >
                {summaryRows.map(([k, v]) => (
                  <Box
                    key={k}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1.75,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ color: "#94A3B8", flex: "none" }}
                    >
                      {k}
                    </Box>
                    <Box component="span" sx={{ textAlign: "right" }}>
                      {v}
                    </Box>
                  </Box>
                ))}
                <Box
                  sx={{
                    height: "1px",
                    background: "rgba(255,255,255,0.12)",
                    my: 0.5,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1.75,
                    alignItems: "flex-start",
                  }}
                >
                  <Box component="span" sx={{ color: "#94A3B8" }}>
                    Reward Products
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                      justifyContent: "flex-end",
                    }}
                  >
                    {summaryRewards.length ? (
                      summaryRewards.map((t) => (
                        <Chip
                          key={t.key}
                          label={t.label}
                          size="small"
                          sx={{
                            height: 24,
                            background: t.color,
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        />
                      ))
                    ) : (
                      <Box
                        component="span"
                        sx={{ color: "#94A3B8", fontSize: 12 }}
                      >
                        None
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Simulation card */}
            <Box
              sx={{
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: "20px 22px 16px",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScienceIcon sx={{ fontSize: 18, color: BRAND }} />
                  <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
                    Apply Simulation
                  </Typography>
                </Box>
                <Typography sx={{ mt: 1, fontSize: 12, color: TEXT_TERTIARY }}>
                  Verify benefit application with a test order before
                  activating.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  <FieldLabel>Test Channel</FieldLabel>
                  <Select
                    value={
                      availableChannels.includes(simChannel) ? simChannel : ""
                    }
                    onChange={(e) => setSimChannel(e.target.value)}
                    displayEmpty
                    sx={{
                      height: 48,
                      borderRadius: "10px",
                      fontSize: 14,
                      "& fieldset": {
                        borderColor: BORDER,
                        borderWidth: "1.5px",
                      },
                    }}
                  >
                    {availableChannels.length === 0 && (
                      <MenuItem value="">No channel</MenuItem>
                    )}
                    {availableChannels.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1 }}>
                    Test Cart
                  </Typography>
                  {/* 제품 검색 → 장바구니 담기 */}
                  <TextField
                    value={simSearch}
                    onChange={(e) => setSimSearch(e.target.value)}
                    placeholder="Search a product to add"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{ fontSize: 16, color: TEXT_TERTIARY }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: "10px",
                        background: "#fff",
                        fontSize: 13,
                        "& fieldset": {
                          borderColor: BORDER,
                          borderWidth: "1.5px",
                        },
                      },
                    }}
                  />
                  {simSearch.trim() && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        mb: 1,
                        maxHeight: 168,
                        overflowY: "auto",
                      }}
                    >
                      {simSearchResults.length ? (
                        simSearchResults.map((p) => (
                          <Box
                            key={p.id}
                            onClick={() => {
                              cartAdd(p.id, 1);
                              setSimSearch("");
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: "7px 10px",
                              border: `1px solid ${BORDER}`,
                              borderRadius: "8px",
                              background: "#fff",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: BRAND,
                                background: BRAND_SOFT,
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                flex: 1,
                                minWidth: 0,
                                fontSize: 12,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 11, color: TEXT_TERTIARY }}
                            >
                              {won(p.price)}
                            </Typography>
                            <AddIcon sx={{ fontSize: 14, color: BRAND }} />
                          </Box>
                        ))
                      ) : (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: TEXT_TERTIARY,
                            px: 1,
                            py: 0.5,
                          }}
                        >
                          No results
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {sim.catalog.length === 0 && (
                      <Typography
                        sx={{ fontSize: 12, color: TEXT_TERTIARY, py: 1 }}
                      >
                        Search and add products to the test cart.
                      </Typography>
                    )}
                    {sim.catalog.map((p) => {
                      const qty = cart[p.id] || 0;
                      const inCart = qty > 0;
                      return (
                        <Box
                          key={p.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            p: "8px 12px",
                            borderRadius: "10px",
                            background: inCart ? BRAND_SOFT : SURFACE_ALT,
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: inCart ? TEXT_PRIMARY : TEXT_SECONDARY,
                              }}
                            >
                              {p.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 11, color: TEXT_TERTIARY }}
                            >
                              {won(p.price)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: `1px solid ${BORDER}`,
                              borderRadius: "999px",
                              background: "#fff",
                              px: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => cartAdd(p.id, -1)}
                              sx={{ color: BRAND }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Box
                              sx={{
                                width: 24,
                                textAlign: "center",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {qty}
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => cartAdd(p.id, 1)}
                              sx={{ color: BRAND }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.5,
                      pt: 1.5,
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
                      Cart Total
                    </Typography>
                    <Typography
                      sx={{ fontSize: 17, fontWeight: 700, color: PRICE }}
                    >
                      {won(sim.cartTotal)}
                    </Typography>
                  </Box>
                </Box>
                {/* Result box */}
                <Box
                  sx={{
                    p: 2.25,
                    borderRadius: "10px",
                    background: sim.applied ? BRAND_SOFT : SURFACE_ALT,
                    border: `1px solid ${sim.applied ? BRAND : BORDER}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "8px 10px",
                      mb: 1.75,
                    }}
                  >
                    <Chip
                      label={sim.applied ? "Promotion Applied" : "Not Applied"}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: 12,
                        fontWeight: 700,
                        background: sim.applied ? BRAND : SURFACE_SUNKEN,
                        color: sim.applied ? "#fff" : TEXT_SECONDARY,
                      }}
                    />
                    <Typography sx={{ fontSize: 12, color: TEXT_SECONDARY }}>
                      {sim.chName} · {won(sim.cartTotal)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}
                  >
                    {sim.checks.map((k, idx) => {
                      const col = k.warn ? WARNING : k.ok ? SUCCESS : DANGER;
                      const bg = k.warn
                        ? WARNING_BG
                        : k.ok
                          ? SUCCESS_BG
                          : DANGER_BG;
                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            gap: 1.25,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              flex: "none",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: bg,
                              color: col,
                            }}
                          >
                            {k.warn ? (
                              <ErrorOutlineIcon sx={{ fontSize: 14 }} />
                            ) : k.ok ? (
                              <CheckCircleIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <CloseIcon sx={{ fontSize: 14 }} />
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                              {k.label}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 12, color: TEXT_TERTIARY }}
                            >
                              {k.detail}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  {/* Option Select: Target 제품 구매 시 Reward 제품 선택 */}
                  {sim.applied &&
                    isOptionGive &&
                    sim.rewardChoices.length > 0 && (
                      <Box
                        sx={{ mt: 2, pt: 2, borderTop: `1px solid ${BORDER}` }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: SUCCESS,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Select Reward
                        </Typography>
                        <Select
                          value={
                            sim.rewardChoices.some(
                              (p) => p.id === simRewardChoice,
                            )
                              ? simRewardChoice
                              : (sim.rewardChoices[0]?.id ?? "")
                          }
                          onChange={(e) => setSimRewardChoice(e.target.value)}
                          fullWidth
                          size="small"
                          sx={{
                            borderRadius: "10px",
                            fontSize: 13,
                            background: "#fff",
                            "& fieldset": {
                              borderColor: BORDER,
                              borderWidth: "1.5px",
                            },
                          }}
                        >
                          {sim.rewardChoices.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  {sim.applied && sim.rewards.length > 0 && (
                    <Box
                      sx={{ mt: 2, pt: 2, borderTop: `1px solid ${BORDER}` }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: SUCCESS,
                          fontWeight: 600,
                          mb: 1.25,
                        }}
                      >
                        Included Benefits
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {sim.rewards.map((r, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.25,
                              p: "10px 12px",
                              background: SUCCESS_BG,
                              borderRadius: "10px",
                            }}
                          >
                            {r.icon === "package" ? (
                              <Inventory2Icon
                                sx={{ fontSize: 16, color: BRAND_STRONG }}
                              />
                            ) : (
                              <CardGiftcardIcon
                                sx={{ fontSize: 16, color: BRAND_STRONG }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Box
                                component="span"
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: BRAND_STRONG,
                                }}
                              >
                                {r.title}
                              </Box>{" "}
                              <Box
                                component="span"
                                sx={{ fontSize: 12, color: TEXT_SECONDARY }}
                              >
                                {r.detail}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Save Promotion 확인 — Summary 를 한 번 더 확인 */}
      {dialog === "save" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={closeSaveDialog}
          maxWidth="sm"
          dialogTitle="Check the Summary before saving"
          dialogContent={
            <Box>
              <Typography
                sx={{ fontSize: 14, color: "black", lineHeight: 1.6 }}
              >
                The promotion will be applied according to its period. Please
                review the summary below one more time.
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: "16px 18px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "10px",
                  background: SURFACE_ALT,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                  {form.name || "New Promotion"}
                </Typography>
                {summaryRows.map(([k, v]) => (
                  <Box
                    key={k}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      fontSize: 13,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ color: TEXT_SECONDARY, flex: "none" }}
                    >
                      {k}
                    </Box>
                    <Box component="span" sx={{ textAlign: "right" }}>
                      {v}
                    </Box>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    fontSize: 13,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ color: TEXT_SECONDARY, flex: "none" }}
                  >
                    Reward Products
                  </Box>
                  <Box component="span" sx={{ textAlign: "right" }}>
                    {summaryRewards.length
                      ? summaryRewards.map((t) => t.label).join(", ")
                      : "None"}
                  </Box>
                </Box>
              </Box>
            </Box>
          }
          dialogCloseLabel="Go back and review"
          dialogConfirmLabel="Save"
          handlePost={() => {
            closeSaveDialog();
            goBack();
          }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Promotion Template: 불러오기 / 템플릿으로 등록 */}
      <TemplatePickerDialog
        open={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onPick={applyTemplate}
      />
      <AlertDialog
        open={saveAsTemplateOpen}
        setOpen={setSaveAsTemplateOpen}
        isButton={false}
        dialogTitle="Save as Template"
        dialogContent={
          <Box
            sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            <Typography sx={{ fontSize: 14 }}>
              Basic Info · Target · Reward of this promotion are saved as a
              template. Period, Sales Channel and Status are not included. A
              template with the same name can be saved again.
            </Typography>
            <TextField
              size="small"
              fullWidth
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Holiday Perfume Gift GWP"
            />
          </Box>
        }
        dialogCloseLabel="Cancel"
        dialogConfirmLabel="Save Template"
        handlePost={handleSaveAsTemplate}
        postButtonProps={{ disabled: !templateName.trim() }}
      />

      {/* Save Draft 확인 */}
      {dialog === "draft" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent="This saves the promotion as a draft; it will not run even when its period arrives. Do you want to save it as a draft?"
          dialogCloseLabel="Cancel"
          dialogConfirmLabel="Save Draft"
          handlePost={() => {
            setDialog(null);
            goBack();
          }}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Cancel 확인 */}
      {dialog === "cancel" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent="The promotion has not been submitted and was not created. Are you sure you want to leave this page?"
          dialogCloseLabel="Stay"
          dialogConfirmLabel="Leave"
          handlePost={() => {
            setDialog(null);
            goBack();
          }}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Delete 확인 (delete 입력 시에만 삭제 가능) */}
      {dialog === "delete" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogTitle="Delete Promotion"
          dialogContent={
            <Box>
              <Typography
                sx={{ fontSize: 14, color: "black", lineHeight: 1.6 }}
              >
                Delete this promotion? Its status changes to Deleted and it will
                no longer be applied to any orders. The settings are kept for
                reference but cannot be edited or restored. Type <b>delete</b>{" "}
                to confirm.
              </Typography>
              <TextField
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete"
                size="small"
                fullWidth
                autoFocus
                sx={{ mt: 2 }}
              />
            </Box>
          }
          dialogCloseLabel="Cancel"
          dialogConfirmLabel="Delete"
          handlePost={() => {
            if (deleteConfirmText.trim().toLowerCase() !== "delete") return;
            setDialog(null);
            goBack();
          }}
          postButtonProps={{
            color: "error",
            disabled: deleteConfirmText.trim().toLowerCase() !== "delete",
          }}
        />
      )}

      {/* Force Stop 확인 (Active → 강제 종료) */}
      {dialog === "forceStop" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent="On confirmation, the promotion ends immediately, and orders paid after the save time will not have the promotion applied. Are you sure you want to stop it?"
          dialogCloseLabel="Cancel"
          dialogConfirmLabel="Stop"
          handlePost={() => {
            setDialog(null);
            goBack();
          }}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "error" }}
        />
      )}

      {/* Option Select 채널 제한 안내 */}
      {dialog === "optionRestricted" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent="This option is only available on the official store."
          dialogConfirmLabel="OK"
          handlePost={() => setDialog(null)}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Option Select 템플릿 불러오기: Official 채널이 없는 Brand & Corp 안내 */}
      {dialog === "optionTemplateNoOfficial" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogTitle="Template not applicable"
          dialogContent="This template uses Option Select, which is only available on the official store. The selected Brand & Corp has no official store channel, so the template cannot be applied."
          dialogConfirmLabel="OK"
          handlePost={() => setDialog(null)}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Option Select 중 사용 불가 채널로 변경 안내 */}
      {dialog === "optionChannelInvalid" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent="Option Select cannot be used with this channel."
          dialogConfirmLabel="OK"
          handlePost={() => setDialog(null)}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* Option Select 제품 개수 제한 안내 */}
      {dialog === "optionMaxReached" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent={`Option Select can offer up to ${OPTION_REWARD_MAX} reward products.`}
          dialogConfirmLabel="OK"
          handlePost={() => setDialog(null)}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}

      {/* 필수값 누락 안내 */}
      {dialog === "invalid" && (
        <AlertDialog
          isButton={false}
          open
          setOpen={() => setDialog(null)}
          maxWidth="xs"
          dialogContent={
            <span style={{ whiteSpace: "pre-line" }}>
              {`Some required fields are missing.\nPlease fill in all required fields.\n\n• ${missingFields.join("\n• ")}`}
            </span>
          }
          dialogConfirmLabel="OK"
          handlePost={() => setDialog(null)}
          dialogContentProps={{ sx: { color: "black" } }}
          postButtonProps={{ color: "primary" }}
        />
      )}
    </Box>
  );

  // ---- section renderers (closures over state) ----
  function renderCondition() {
    const f = form;

    // Reward Basis 블록 (Specific Product / All Products 공통)
    const rewardBasisBlock = (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}
        >
          Reward Basis
        </Typography>
        <Segmented
          value={f.rewardBasis}
          onChange={(v) => patch({ rewardBasis: v })}
          // Packaging Benefit 은 Per product quantity 로 고정
          disabled={locked || isPkg}
          options={[
            { value: "order", label: "Per order", disabled: isPkg },
            { value: "product", label: "Per product quantity" },
          ]}
        />
        <Typography
          sx={{ fontSize: 12, color: TEXT_TERTIARY, lineHeight: 1.5 }}
        >
          {isPkg
            ? "Packaging Benefit is always given per product quantity. Reward Basis is fixed to Per product quantity."
            : f.rewardBasis === "product"
              ? f.condMode === "allProducts"
                ? "Rewards are given in proportion to the number of eligible products in the order. e.g. buying 3 eligible products gives 3 rewards."
                : `Rewards are given in proportion to purchase quantity. e.g. with a threshold of ${f.buyQty || 1}, buying ${(f.buyQty || 1) * 3} target products gives ${(f.buyQty || 1) * 3} rewards.`
              : "The reward is given once per order when the condition is met. e.g. no matter how many target products are bought, 1 set is given."}
        </Typography>
      </Box>
    );

    // Excluded Product 블록 (Order Amount / All Products 공통)
    const excludedBlock = (
      <>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ListHeader
            label="Excluded Products"
            count={f.excludeTargets.length}
            onClear={() => clearList("excludeTargets")}
            disabled={locked}
          />
          {f.excludeTargets.length ? (
            f.excludeTargets.map((p, i) => (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: "11px 8px 11px 14px",
                  border: `1px solid ${BORDER_STRONG}`,
                  background: SURFACE_SUNKEN,
                  borderRadius: "10px",
                }}
              >
                <Chip
                  label="Excluded"
                  size="small"
                  sx={{
                    height: 22,
                    background: "#FBE3E6",
                    color: "#B4485A",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </Typography>
                <Typography
                  sx={{ color: PRICE, fontSize: 13, fontWeight: 600 }}
                >
                  {won(p.price)}
                </Typography>
                {!locked && (
                  <IconButton
                    size="small"
                    onClick={() => removeAt("excludeTargets", i)}
                    sx={{ color: TEXT_TERTIARY }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <EmptyHint text="With no exclusions, all products are eligible." />
          )}
        </Box>
        {!locked && (
          <SearchBlock
            currency={currency}
            label="Add Excluded Product"
            note="Excluded from eligibility even if purchased · model code search supported"
            query={excludeQuery}
            field={excludeField}
            onField={setExcludeField}
            matches={excludeMatches}
            onQuery={setExcludeQuery}
            onAddOne={(id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              if (p) addToList("excludeTargets", p);
            }}
            onAddAll={() => addAll("excludeTargets", excludeMatches)}
          />
        )}
      </>
    );

    if (f.condMode === "amount") {
      const lastIdx = f.amountRanges.length - 1;
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            sx={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.6 }}
          >
            Rewards apply per order amount range. Lower bound is inclusive (≥),
            upper bound is exclusive (&lt;). Each range gets its own reward
            setting in step 4. Amounts are in {currency.code} — the currency
            follows the corporation selected in Brand &amp; Corp.
          </Typography>

          {currencyChanged && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: "10px 14px",
                borderRadius: "10px",
                background: WARNING_BG,
                color: WARNING,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 18 }} />
              Currency changed to {currency.code}. Amounts were kept as typed —
              please review each range.
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}
            >
              Order Amount Ranges{" "}
              <Box component="span" sx={{ color: TEXT_TERTIARY }}>
                ({f.amountRanges.length}/{MAX_AMOUNT_RANGES})
              </Box>
            </Typography>

            {f.amountRanges.map((r, i) => {
              const isLast = i === lastIdx;
              return (
                <Box
                  key={r.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    flexWrap: "wrap",
                    p: "12px 14px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "10px",
                    background: SURFACE_ALT,
                  }}
                >
                  <Chip
                    label={`Range ${i + 1}`}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      background: rangeColor(i),
                    }}
                  />
                  <TextField
                    type="number"
                    value={r.min}
                    onChange={(e) =>
                      patchRange(i, { min: Number(e.target.value) || 0 })
                    }
                    disabled={locked}
                    sx={{ width: 190, ...inputSx }}
                    inputProps={{
                      min: 0,
                      step: currency.fractionDigits ? 0.01 : 1,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">≥</InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {currency.code}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography sx={{ color: TEXT_TERTIARY }}>~</Typography>
                  {r.unlimited ? (
                    <Box
                      sx={{
                        width: 190,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        border: `1.5px solid ${BORDER}`,
                        borderRadius: "10px",
                        background: SURFACE_SUNKEN,
                        color: TEXT_TERTIARY,
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Unlimited ∞
                    </Box>
                  ) : (
                    <TextField
                      type="number"
                      value={r.max}
                      onChange={(e) =>
                        patchRange(i, { max: Number(e.target.value) || 0 })
                      }
                      disabled={locked}
                      sx={{ width: 190, ...inputSx }}
                      inputProps={{
                        min: 0,
                        step: currency.fractionDigits ? 0.01 : 1,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">&lt;</InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {currency.code}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {isLast && (
                    <Box
                      onClick={() => !locked && toggleLastUnlimited()}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.25,
                        cursor: locked ? "default" : "pointer",
                      }}
                    >
                      <Switch
                        size="small"
                        checked={r.unlimited}
                        disabled={locked}
                      />
                      <Typography sx={{ fontSize: 12, color: TEXT_SECONDARY }}>
                        No maximum limit
                      </Typography>
                    </Box>
                  )}
                  {!locked && f.amountRanges.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeRange(i)}
                      sx={{ color: TEXT_TERTIARY, ml: "auto" }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              );
            })}

            {!locked && f.amountRanges.length < MAX_AMOUNT_RANGES && (
              <Button
                onClick={addRange}
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "none",
                  border: `1px dashed ${BRAND}`,
                  background: BRAND_SOFT,
                  color: BRAND,
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: 13,
                  py: 1.25,
                  "&:hover": { background: BRAND_TINT },
                }}
              >
                Add Range
              </Button>
            )}

            <Typography
              sx={{ fontSize: 12, color: TEXT_TERTIARY, lineHeight: 1.6 }}
            >
              Max {MAX_AMOUNT_RANGES} ranges · The upper bound (&lt;) of a range
              is the lower bound (≥) of the next range · No gaps or overlaps ·
              Only the last range can be unlimited.
            </Typography>
          </Box>

          {excludedBlock}
        </Box>
      );
    }
    if (f.condMode === "allProducts") {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
            All orders purchasing any product receive the reward. The excluded
            products below are not eligible even if purchased.
          </Typography>
          {excludedBlock}
          <Box
            sx={{
              p: "16px 18px",
              background: SURFACE_ALT,
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
            }}
          >
            {rewardBasisBlock}
          </Box>
        </Box>
      );
    }
    // Specific Product (Target)
    const emptyHint = "Search and add target products below.";
    const addLabel = "Add Target Product";
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
            <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
              Target Purchase Basis
            </Typography>
            <Segmented
              value={f.productMatch}
              onChange={(v) => patch({ productMatch: v })}
              disabled={locked}
              options={[
                { value: "any", label: "Any" },
                { value: "all", label: "All" },
              ]}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: TEXT_TERTIARY }}>
            {f.productMatch === "all"
              ? "All selected products must be in the cart (AND)."
              : "Any one of the selected products satisfies the condition."}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ListHeader
            label="Selected Products"
            count={f.targets.length}
            onClear={() => clearList("targets")}
            disabled={locked}
          />
          {targetAddOnly && (
            <Typography sx={{ fontSize: 12, color: TEXT_TERTIARY }}>
              While the promotion is Active, target products can only be added.
              Products already saved cannot be removed.
            </Typography>
          )}
          {f.targets.length ? (
            f.targets.map((p, i) => (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: "11px 8px 11px 14px",
                  border: `1px solid ${BRAND}`,
                  background: BRAND_SOFT,
                  borderRadius: "10px",
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: TEXT_TERTIARY }}>
                  {p.category}
                </Typography>
                <Typography
                  sx={{ color: PRICE, fontSize: 13, fontWeight: 600 }}
                >
                  {won(p.price)}
                </Typography>
                {/* Active 상태에서는 이번에 새로 추가한 제품만 되돌릴 수 있음 */}
                {(!locked ||
                  (targetAddOnly && !initialTargetIds.has(p.id))) && (
                  <IconButton
                    size="small"
                    onClick={() => removeAt("targets", i)}
                    sx={{ color: TEXT_TERTIARY }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <EmptyHint text={emptyHint} />
          )}
        </Box>
        {(!locked || targetAddOnly) && (
          <SearchBlock
            currency={currency}
            label={addLabel}
            note="Linked to product DB · searching a model code shows all products under that model."
            query={targetQuery}
            field={targetField}
            onField={setTargetField}
            matches={targetMatches}
            onQuery={setTargetQuery}
            onAddOne={(id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              if (p) addToList("targets", p);
            }}
            onAddAll={() => addAll("targets", targetMatches)}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: "16px 18px",
            background: SURFACE_ALT,
            border: `1px solid ${BORDER}`,
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}
            >
              Purchase Quantity
            </Typography>
            <Typography sx={{ fontSize: 13, color: TEXT_TERTIARY }}>
              Target product
            </Typography>
            <TextField
              type="number"
              value={f.buyQty}
              onChange={(e) =>
                // 정수만 허용 · 범위를 벗어난 값은 1 ~ 99 로 자동 보정
                patch({
                  buyQty: Math.min(
                    BUY_QTY_MAX,
                    Math.max(
                      BUY_QTY_MIN,
                      Math.floor(Number(e.target.value)) || BUY_QTY_MIN,
                    ),
                  ),
                })
              }
              inputProps={{ min: BUY_QTY_MIN, max: BUY_QTY_MAX, step: 1 }}
              disabled={locked}
              sx={{
                width: 140,
                ...inputSx,
                "& .MuiOutlinedInput-root": {
                  ...inputSx["& .MuiOutlinedInput-root"],
                  height: 42,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">or more</InputAdornment>
                ),
              }}
            />
          </Box>
          {rewardBasisBlock}
        </Box>
      </Box>
    );
  }

  // Reward 제품 목록 한 벌 (rangeId 를 주면 해당 금액 구간 전용 목록)
  function renderRewardList(rangeId?: string) {
    const f = form;
    const list = rangeId ? (f.rangeRewards[rangeId] ?? []) : f.rewardProducts;
    const query = rangeId ? (rangeRewardQuery[rangeId] ?? "") : rewardQuery;
    const field = rangeId ? (rangeRewardField[rangeId] ?? "sap") : rewardField;
    const onQuery = (v: string) =>
      rangeId
        ? setRangeRewardQuery((prev) => ({ ...prev, [rangeId]: v }))
        : setRewardQuery(v);
    const onField = (v: SearchField) =>
      rangeId
        ? setRangeRewardField((prev) => ({ ...prev, [rangeId]: v }))
        : setRewardField(v);
    const matches = rangeId
      ? PRODUCTS.filter(
          (p) =>
            !list.some((t) => t.id === p.id) &&
            (!isPkg || p.category === "Package") &&
            matchProduct(p, field, query),
        )
      : rewardMatches;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <ListHeader
          label="Selected Reward Products"
          count={list.length}
          onClear={() => clearRewards(rangeId)}
          disabled={locked}
        />
        {list.map((t, i) => {
          const key = invKeyOf(t.id, rangeId);
          const inv = invOf(key);
          return (
            <Box
              key={t.id}
              sx={{
                p: "16px 18px",
                border: `1px solid ${BRAND}`,
                background: BRAND_SOFT,
                borderRadius: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                {isPkg ? (
                  <Inventory2Icon sx={{ fontSize: 20, color: BRAND }} />
                ) : (
                  <CardGiftcardIcon sx={{ fontSize: 20, color: BRAND }} />
                )}
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: TEXT_TERTIARY }}>
                  {t.category}
                </Typography>
                <Typography
                  sx={{ color: PRICE, fontSize: 13, fontWeight: 600 }}
                >
                  {won(t.price)}
                </Typography>
                {!locked && (
                  <IconButton
                    size="small"
                    onClick={() => removeRewardAt(i, rangeId)}
                    sx={{ color: TEXT_TERTIARY }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
              </Box>
              {isPkg ? (
                <Box
                  sx={{
                    mt: 1.75,
                    p: "14px 16px",
                    border: `1px dashed ${BORDER_STRONG}`,
                    borderRadius: "10px",
                    background: SURFACE_SUNKEN,
                    fontSize: 12,
                    color: TEXT_TERTIARY,
                    lineHeight: 1.5,
                  }}
                >
                  Packaging Benefit type is provided without any quantity limit
                  during the promotion period.
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 1.25,
                    mt: 1.75,
                  }}
                >
                  {INVENTORY_FIELDS.map((fieldName) => {
                    // 신규 등록 시 판매 수량은 항상 0
                    const sold = mode === "add" ? 0 : inv.sold;
                    // Sold(판매 수량) · Remaining(잔여 재고)는 수기 입력 불가
                    const computed =
                      fieldName === "sold" || fieldName === "remaining";
                    const value =
                      fieldName === "sold"
                        ? sold
                        : fieldName === "remaining"
                          ? Math.max(0, inv.total - sold)
                          : inv[fieldName];
                    return (
                      <Box
                        key={fieldName}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 12, color: TEXT_SECONDARY }}
                        >
                          {INVENTORY_FIELD_LABELS[fieldName]}
                        </Typography>
                        <TextField
                          type="number"
                          value={value}
                          onChange={(e) => {
                            if (computed) return;
                            setInv(key, fieldName, Number(e.target.value) || 0);
                          }}
                          disabled={computed || readOnly}
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              height: 42,
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">ea</InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
        {!list.length && (
          <EmptyHint text="Search and add reward products below." />
        )}
        {!locked && (
          <SearchBlock
            currency={currency}
            label="Add Reward Product"
            note={
              isPkg
                ? "Only Package-category products can be searched/selected · model code search supported"
                : "Linked to product DB · searching a model code shows all products under that model."
            }
            subNote={
              isPkg
                ? "Only products in the Package category can be added as rewards for Packaging Benefit."
                : undefined
            }
            query={query}
            field={field}
            onField={onField}
            matches={matches}
            onQuery={onQuery}
            onAddOne={(id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              if (!p) return;
              if (list.length >= rewardLimit) {
                setDialog("optionMaxReached");
                return;
              }
              addReward(p, rangeId);
            }}
            onAddAll={() => {
              if (list.length + matches.length > rewardLimit) {
                setDialog("optionMaxReached");
                return;
              }
              addRewardAll(matches, rangeId);
            }}
          />
        )}
      </Box>
    );
  }

  function renderReward() {
    const f = form;
    const isAmount = f.condMode === "amount";

    // 증정 방식 (Target = Specific Product / Order Amount 일 때)
    const rewardTypeBlock = f.condMode !== "allProducts" && (
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 0.5 }}
      >
        <FieldLabel>Reward Type</FieldLabel>
        <Segmented
          value={f.rewardGive}
          onChange={handleRewardGive}
          disabled={locked}
          options={[
            { value: "default", label: "Default Gift" },
            { value: "option", label: "Option Select" },
          ]}
        />
        <Typography
          sx={{ fontSize: 12, color: TEXT_TERTIARY, lineHeight: 1.6 }}
        >
          {f.rewardGive === "option"
            ? isAmount
              ? `The customer chooses 1 gift from the reward products of the range their order amount falls into. Up to ${OPTION_REWARD_MAX} reward products per range.`
              : `The customer chooses 1 gift from the reward products below. Up to ${OPTION_REWARD_MAX} reward products can be offered as choices. (${f.rewardProducts.length}/${OPTION_REWARD_MAX} selected)`
            : isAmount
              ? "All reward products set for the matching range are given as gifts."
              : "All reward products below are given as gifts."}
        </Typography>
      </Box>
    );

    if (isAmount) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {rewardTypeBlock}
          <Typography
            sx={{ fontSize: 12, color: TEXT_TERTIARY, lineHeight: 1.6 }}
          >
            Reward products are set per order amount range.
            {isPkg
              ? ""
              : " GWP manages total/sold/alert quantity per reward product within each range."}
          </Typography>
          {f.amountRanges.map((r, i) => {
            const list = f.rangeRewards[r.id] ?? [];
            return (
              <Box
                key={r.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  p: "18px 20px",
                  border: `1px solid ${BORDER}`,
                  borderLeft: `4px solid ${rangeColor(i)}`,
                  borderRadius: "12px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={`Range ${i + 1}`}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      background: rangeColor(i),
                    }}
                  />
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    {rangeText(r, currency)}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: TEXT_TERTIARY, ml: "auto" }}
                  >
                    {isOptionGive
                      ? `Option Select · ${list.length}/${OPTION_REWARD_MAX} selected`
                      : `Default Gift · ${list.length} selected`}
                  </Typography>
                </Box>
                {renderRewardList(r.id)}
              </Box>
            );
          })}
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {rewardTypeBlock}
        {renderRewardList()}
      </Box>
    );
  }
}
