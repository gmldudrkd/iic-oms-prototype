"use client";

import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import {
  BORDER,
  BORDER_STRONG,
  BRAND,
  BRAND_SOFT,
  PURPLE,
  PURPLE_BG,
  SURFACE_SUNKEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  WARNING,
  WARNING_BG,
} from "@/features/promotion-template/modules/constants";
import { TemplateType } from "@/features/promotion-template/modules/types";

export function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <Typography
      component="div"
      sx={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}
    >
      {children}
      {hint && (
        <Typography
          component="span"
          sx={{ ml: 0.75, fontSize: 12, color: TEXT_TERTIARY }}
        >
          {hint}
        </Typography>
      )}
    </Typography>
  );
}

export function Note({
  children,
  warn,
}: {
  children: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <Typography sx={{ fontSize: 12, color: warn ? WARNING : TEXT_TERTIARY }}>
      {children}
    </Typography>
  );
}

export function SectionCard({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        p: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "999px",
            background: BRAND_SOFT,
            color: BRAND,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {num}
        </Box>
        <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}

// 알약형 세그먼트 (PromotionFormV2 와 동일 스타일)
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  disabled,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  // 옵션 단위 disabled 로 특정 선택지만 비활성화할 수 있다
  options: { value: T; label: string; disabled?: boolean }[];
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <ToggleButtonGroup
      exclusive
      disabled={disabled}
      value={value}
      onChange={(_, v) => v && onChange(v as T)}
      sx={{
        alignSelf: "flex-start",
        background: SURFACE_SUNKEN,
        p: "3px",
        borderRadius: "999px",
        gap: "4px",
        flexWrap: "wrap",
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          px: size === "sm" ? 1.5 : 2,
          py: size === "sm" ? 0.5 : 0.75,
          fontSize: size === "sm" ? 12 : 13,
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

export function TypeBadge({ type }: { type: TemplateType }) {
  const gwp = type === "GWP";
  return (
    <Chip
      label={gwp ? "GWP · Free Gift" : "Packaging Benefit"}
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".02em",
        background: gwp ? BRAND_SOFT : WARNING_BG,
        color: gwp ? BRAND : WARNING,
      }}
    />
  );
}

export function OptionBadge() {
  return (
    <Chip
      label="Option Select"
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        background: PURPLE_BG,
        color: PURPLE,
      }}
    />
  );
}

export function DraftBadge() {
  return (
    <Chip
      label="DRAFT"
      size="small"
      variant="outlined"
      sx={{
        height: 20,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: ".04em",
        color: TEXT_SECONDARY,
        borderStyle: "dashed",
        borderColor: BORDER_STRONG,
        background: SURFACE_SUNKEN,
      }}
    />
  );
}

export function EmptyHint({ text }: { text: string }) {
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

export function ChannelDot({ color }: { color: string }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: color,
        flex: "none",
      }}
    />
  );
}
