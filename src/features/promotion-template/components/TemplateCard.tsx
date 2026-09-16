"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  OptionBadge,
  TypeBadge,
} from "@/features/promotion-template/components/atoms";
import {
  BORDER,
  BORDER_STRONG,
  BRAND,
  DANGER,
  SURFACE_SUNKEN,
  TARGET_MODE_LABEL,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from "@/features/promotion-template/modules/constants";
import { PromotionTemplate } from "@/features/promotion-template/modules/types";
import { productName } from "@/features/promotion-template/modules/utils";

const cardSx = {
  border: `1px solid ${BORDER}`,
  borderRadius: "10px",
  p: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  background: "#fff",
} as const;

interface Props {
  template: PromotionTemplate;
  onEdit: (t: PromotionTemplate) => void;
  onMulti: (t: PromotionTemplate) => void;
  onDelete: (t: PromotionTemplate) => void;
}

export default function TemplateCard({
  template: t,
  onEdit,
  onMulti,
  onDelete,
}: Props) {
  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.35,
            color: TEXT_PRIMARY,
          }}
        >
          {t.name}
        </Typography>
      </Box>

      {/* 노출 항목: Promotion Type · Target Type · Reward 제품 (값은 배지로 표시) */}
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "6px 12px",
          alignItems: "center",
          fontSize: 12.5,
          "& dt": { color: TEXT_TERTIARY },
          "& dd": { m: 0, color: TEXT_SECONDARY, minWidth: 0 },
        }}
      >
        <dt>Promotion Type</dt>
        <dd>
          <TypeBadge type={t.type} />
        </dd>
        <dt>Target Type</dt>
        <dd>
          <Chip
            label={TARGET_MODE_LABEL[t.tmode]}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              background: SURFACE_SUNKEN,
              color: TEXT_SECONDARY,
            }}
          />
        </dd>
        <dt>Reward</dt>
        <dd>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {/* Option Select 는 Reward 정보 앞에 배지로 표시 */}
            {t.rewardType === "option" && (
              <Box sx={{ mb: "2px" }}>
                <OptionBadge />
              </Box>
            )}
            {t.rewards.map((sap) => (
              <Typography key={sap} sx={{ fontSize: 12.5, lineHeight: 1.35 }}>
                {productName(sap)}{" "}
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 11.5,
                    color: TEXT_TERTIARY,
                  }}
                >
                  {sap}
                </Typography>
              </Typography>
            ))}
          </Box>
        </dd>
      </Box>

      <Box
        sx={{
          mt: "auto",
          pt: 1,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* 좌측은 비워 둠 (등록 이력 등 추적 정보 없음) */}
        <span />
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            flex: "none",
            alignItems: "center",
          }}
        >
          <Tooltip title="Delete template">
            <IconButton
              size="small"
              onClick={() => onDelete(t)}
              aria-label="delete template"
              sx={{ color: TEXT_TERTIARY, "&:hover": { color: DANGER } }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(t)}
            sx={{ textTransform: "none", fontSize: 12 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => onMulti(t)}
            sx={{ textTransform: "none", fontSize: 12 }}
          >
            Multi Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export function NewTemplateCard({ onClick }: { onClick: () => void }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      sx={{
        ...cardSx,
        background: "transparent",
        borderStyle: "dashed",
        borderColor: BORDER_STRONG,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 170,
        color: TEXT_TERTIARY,
        cursor: "pointer",
        fontSize: 14,
        "&:hover": { borderColor: BRAND, color: BRAND },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <AddIcon sx={{ fontSize: 18 }} /> New Template
      </Box>
    </Box>
  );
}
