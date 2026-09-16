"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Dialog,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import {
  EmptyHint,
  OptionBadge,
  TypeBadge,
} from "@/features/promotion-template/components/atoms";
import {
  BORDER,
  BRAND,
  BRAND_SOFT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from "@/features/promotion-template/modules/constants";
import { MOCK_TEMPLATES } from "@/features/promotion-template/modules/mockData";
import {
  PromotionTemplate,
  TemplateFilter,
} from "@/features/promotion-template/modules/types";
import {
  conditionDesc,
  rewardDesc,
  targetDesc,
} from "@/features/promotion-template/modules/utils";

const FILTERS: { value: TemplateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "GWP", label: "GWP · Free Gift" },
  { value: "PACKAGE", label: "Packaging Benefit" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  // 선택한 템플릿을 호출 화면(프로모션 등록)에 채운다
  onPick: (t: PromotionTemplate) => void;
}

// 프로모션 등록 화면에서 템플릿을 골라 불러오는 팝업
export default function TemplatePickerDialog({ open, onClose, onPick }: Props) {
  const [filter, setFilter] = useState<TemplateFilter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_TEMPLATES.filter(
      (t) =>
        (filter === "all" || t.type === filter) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          rewardDesc(t).toLowerCase().includes(q) ||
          t.rewards.some((s) => s.includes(q))),
    );
  }, [filter, query]);

  const picked = list.find((t) => t.id === selected) ?? null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px", maxHeight: "88vh" } }}
    >
      <Box
        sx={{ px: 3, pt: 2.25, pb: 1.5, borderBottom: `1px solid ${BORDER}` }}
      >
        <Typography
          sx={{
            fontSize: 12,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: TEXT_TERTIARY,
            fontWeight: 500,
          }}
        >
          Load Template
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Choose a template to fill in Basic Info · Target · Reward
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: TEXT_SECONDARY, mt: 0.5 }}>
          Period, Sales Channel and Status are not part of a template and stay
          as entered.
        </Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {FILTERS.map((f) => {
              const on = filter === f.value;
              return (
                <Chip
                  key={f.value}
                  label={f.label}
                  size="small"
                  onClick={() => setFilter(f.value)}
                  variant={on ? "filled" : "outlined"}
                  sx={{
                    background: on ? TEXT_PRIMARY : "#fff",
                    color: on ? "#fff" : TEXT_SECONDARY,
                    "&:hover": { background: on ? TEXT_PRIMARY : undefined },
                  }}
                />
              );
            })}
          </Box>
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search template name or reward"
            sx={{ width: 300, "& .MuiInputBase-root": { fontSize: 13 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {list.length === 0 ? (
          <EmptyHint text="No templates match." />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {list.map((t) => {
              const on = t.id === selected;
              return (
                <Box
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(t.id)}
                  onDoubleClick={() => onPick(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onPick(t);
                  }}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.4fr)",
                    gap: 2,
                    alignItems: "center",
                    p: "10px 14px",
                    border: `1px solid ${on ? BRAND : BORDER}`,
                    background: on ? BRAND_SOFT : "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: 12.5,
                    "&:hover": { borderColor: BRAND },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}
                    >
                      {t.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                      <TypeBadge type={t.type} />
                      {t.rewardType === "option" && <OptionBadge />}
                    </Box>
                  </Box>
                  <Box sx={{ color: TEXT_SECONDARY }}>
                    <div>{targetDesc(t)}</div>
                    <div>{conditionDesc(t)}</div>
                  </Box>
                  <Box sx={{ color: TEXT_SECONDARY, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12.5 }} noWrap>
                      {rewardDesc(t)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: TEXT_TERTIARY,
                        fontFamily: "ui-monospace, Menlo, monospace",
                      }}
                      noWrap
                    >
                      {t.rewards.join(", ")}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 12, color: TEXT_TERTIARY }}>
          {picked
            ? `Loading "${picked.name}" replaces the current Basic Info · Target · Reward.`
            : "Select a template. Double-click to load right away."}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!picked}
            onClick={() => picked && onPick(picked)}
            sx={{ textTransform: "none" }}
          >
            Load Template
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
