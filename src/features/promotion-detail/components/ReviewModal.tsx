"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import type {
  ConditionType,
  ModalItem,
} from "@/features/promotion-detail/components/ProductModal";

// --- Shared Tag ---
function CondTag({ type }: { type: ConditionType }) {
  const isAnd = type === "AND";
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        height: 20,
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: isAnd ? "#EFF8FF" : "#ECFDF3",
        color: isAnd ? "#1570EF" : "#099250",
        border: `1px solid ${isAnd ? "#B2DDFF" : "#A9EFC5"}`,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

function HighlightChip({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "purple" | "blue" | "gray" | "orange";
}) {
  const colorMap = {
    purple: { bg: "#F0EDFF", text: "#4C2EC7" },
    blue: { bg: "#EFF8FF", text: "#1570EF" },
    gray: { bg: "#F2F4F7", text: "#344054" },
    orange: { bg: "#FFF7ED", text: "#9A3412" },
  };
  const c = colorMap[color];
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        height: 26,
        fontSize: 13,
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
        "& .MuiChip-label": { px: 1.5 },
      }}
    />
  );
}

const PREVIEW_LIMIT = 3;

// --- Trigger Sentence ---
function TriggerSentence({
  items,
  topCond,
}: {
  items: ModalItem[];
  topCond: ConditionType;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, PREVIEW_LIMIT);
  const hidden = items.length - PREVIEW_LIMIT;

  return (
    <Box component="span" sx={{ display: "inline", lineHeight: 2.4 }}>
      {visible.map((item, idx) => (
        <Box
          key={idx}
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          {idx > 0 && <CondTag type={topCond} />}
          {item.type === "product" ? (
            <Chip
              icon={<span style={{ fontSize: 14 }}>{item.img}</span>}
              label={item.name}
              size="small"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: "#F9FAFB",
                border: "1px solid #EAECF0",
                height: 28,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          ) : (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: item.color?.bg ?? "#F2F4F7",
                border: `1px solid ${item.color?.border ?? "#D0D5DD"}`,
                borderRadius: 1,
                px: 1,
                py: 0.25,
                flexWrap: "wrap",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: item.color?.text ?? "#344054",
                  opacity: 0.7,
                }}
              >
                {item.name}
              </Typography>
              {item.products.map((p, pi) => (
                <Box
                  key={p.id}
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {pi > 0 && <CondTag type={item.condition} />}
                  <Typography
                    component="span"
                    sx={{ fontSize: 13, color: item.color?.text ?? "#344054" }}
                  >
                    {p.img} {p.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
      {!expanded && hidden > 0 && (
        <Chip
          label={`+${hidden} more`}
          size="small"
          onClick={() => setExpanded(true)}
          sx={{
            ml: 0.5,
            height: 22,
            fontSize: 12,
            fontWeight: 600,
            color: "#7C5CFC",
            backgroundColor: "#F0EDFF",
            border: "1px solid #C4B5FD",
            cursor: "pointer",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      )}
      {expanded && hidden > 0 && (
        <Typography
          component="span"
          onClick={() => setExpanded(false)}
          sx={{
            ml: 0.5,
            fontSize: 12,
            fontWeight: 600,
            color: "#98A2B3",
            cursor: "pointer",
          }}
        >
          show less
        </Typography>
      )}
    </Box>
  );
}

// --- Reward Sentence ---
interface RewardSummary {
  name: string;
  img: string;
  qty: number;
  id: string;
}

function RewardSentence({ rewards }: { rewards: RewardSummary[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rewards : rewards.slice(0, PREVIEW_LIMIT);
  const hidden = rewards.length - PREVIEW_LIMIT;

  return (
    <Box component="span" sx={{ display: "inline", lineHeight: 2.4 }}>
      {visible.map((r, idx) => (
        <Box
          key={r.id}
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
        >
          {idx > 0 && (
            <Typography
              component="span"
              sx={{ color: "#98A2B3", fontSize: 13, mx: 0.25 }}
            >
              +
            </Typography>
          )}
          <Chip
            icon={<span style={{ fontSize: 14 }}>{r.img}</span>}
            label={
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                {r.name}
                <Box
                  component="span"
                  sx={{
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    borderRadius: 0.5,
                    px: 0.5,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  x{r.qty}
                </Box>
              </Box>
            }
            size="small"
            sx={{
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: "#FFF7ED",
              border: "1px solid #FED7AA",
              color: "#9A3412",
              height: 28,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>
      ))}
      {!expanded && hidden > 0 && (
        <Chip
          label={`+${hidden} more`}
          size="small"
          onClick={() => setExpanded(true)}
          sx={{
            ml: 0.5,
            height: 22,
            fontSize: 12,
            fontWeight: 600,
            color: "#F97316",
            backgroundColor: "#FFF7ED",
            border: "1px solid #FED7AA",
            cursor: "pointer",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      )}
      {expanded && hidden > 0 && (
        <Typography
          component="span"
          onClick={() => setExpanded(false)}
          sx={{
            ml: 0.5,
            fontSize: 12,
            fontWeight: 600,
            color: "#98A2B3",
            cursor: "pointer",
          }}
        >
          show less
        </Typography>
      )}
    </Box>
  );
}

// --- Review Modal ---
interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    type: string;
    brand: string;
    corp: string;
    startDate: string;
    endDate: string;
    triggerType: string;
  };
  triggerItems: ModalItem[];
  triggerTopCond: ConditionType;
  exceptionItems: ModalItem[];
  exceptionTopCond: ConditionType;
  rewardProducts: RewardSummary[];
  totalDedicated: number;
  totalAlert: number;
}

export default function ReviewModal({
  open,
  onClose,
  onConfirm,
  formData,
  triggerItems,
  triggerTopCond,
  exceptionItems,
  exceptionTopCond,
  rewardProducts,
  totalDedicated,
  totalAlert,
}: ReviewModalProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!open) {
      setCountdown(10);
      return;
    }
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, countdown]);

  const formatDate = (d: string) => {
    if (!d) return "—";
    return d.replace(/-/g, ". ").slice(0, 12);
  };

  const steps = useMemo(
    () => [
      {
        num: 1,
        color: "#7C5CFC",
        label: "Promotion Overview",
        content: (
          <Box
            sx={{
              fontSize: 14,
              color: "#344054",
              lineHeight: 2.4,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <span>You are about to create a</span>
            <HighlightChip color="purple">{formData.type || "—"}</HighlightChip>
            <span>promotion for</span>
            <HighlightChip color="gray">
              {formData.brand || "—"} · {formData.corp || "—"}
            </HighlightChip>
            <span>running from</span>
            <HighlightChip color="blue">
              {formatDate(formData.startDate)}
            </HighlightChip>
            <span>to</span>
            <HighlightChip color="blue">
              {formatDate(formData.endDate)}
            </HighlightChip>
          </Box>
        ),
      },
      {
        num: 2,
        color: "#1570EF",
        label: "Purchase Condition",
        content: (
          <>
            <Box
              sx={{
                fontSize: 14,
                color: "#344054",
                lineHeight: 2.4,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span>When a customer purchases</span>
              <TriggerSentence items={triggerItems} topCond={triggerTopCond} />
            </Box>
            {exceptionItems.length > 0 && (
              <Box
                sx={{
                  fontSize: 14,
                  color: "#344054",
                  lineHeight: 2.4,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                <span>Excluding</span>
                <TriggerSentence
                  items={exceptionItems}
                  topCond={exceptionTopCond}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.75 }}>
              <Chip
                label={`Trigger Type: ${formData.triggerType || "—"}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 12,
                  color: "#667085",
                  backgroundColor: "#F9FAFB",
                }}
              />
              <Chip
                label={
                  <>
                    Items condition: <strong>{triggerTopCond}</strong>
                  </>
                }
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 12,
                  color: "#667085",
                  backgroundColor: "#F9FAFB",
                }}
              />
            </Box>
          </>
        ),
      },
      {
        num: 3,
        color: "#F97316",
        label: "Reward",
        content: (
          <Box
            sx={{
              fontSize: 14,
              color: "#344054",
              lineHeight: 2.4,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <span>The customer will receive</span>
            <RewardSentence rewards={rewardProducts} />
          </Box>
        ),
      },
      {
        num: 4,
        color: "#099250",
        label: "GWP Inventory",
        content: (
          <Box
            sx={{
              fontSize: 14,
              color: "#344054",
              lineHeight: 2.4,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <HighlightChip color="gray">
              {totalDedicated.toLocaleString()} units
            </HighlightChip>
            <span>
              will be reserved exclusively for this GWP. An alert will be
              triggered when stock falls below
            </span>
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
              label={`${totalAlert.toLocaleString()} units`}
              size="small"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: "#FFF4ED",
                border: "1px solid #F97316",
                color: "#9A3412",
                height: 28,
              }}
            />
          </Box>
        ),
      },
    ],
    [
      formData,
      triggerItems,
      triggerTopCond,
      exceptionItems,
      exceptionTopCond,
      rewardProducts,
      totalDedicated,
      totalAlert,
    ],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#FFFAEB",
            border: "1px solid #FEC84B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#101828" }}>
            Please review before submitting
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.25 }}>
            Check the promotion details carefully. This action cannot be undone
            once confirmed.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {steps.map((step, idx) => (
          <Box
            key={step.num}
            sx={{
              display: "flex",
              gap: 0,
              pb: idx < steps.length - 1 ? 2 : 0,
              mb: idx < steps.length - 1 ? 2 : 0,
              borderBottom:
                idx < steps.length - 1 ? "1px solid #F2F4F7" : "none",
            }}
          >
            <Box
              sx={{
                width: 28,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: step.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {step.num}
              </Box>
              {idx < steps.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    backgroundColor: "#F2F4F7",
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, pl: 2, pt: 0.25 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#98A2B3",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mb: 1,
                }}
              >
                {step.label}
              </Typography>
              {step.content}
            </Box>
          </Box>
        ))}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid #EAECF0",
          px: 3,
          py: 1.5,
          justifyContent: "flex-end",
        }}
      >
        {countdown > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
            <Typography sx={{ fontSize: 12, color: "#98A2B3" }}>
              Please review carefully.
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#F0EDFF",
                border: "1.5px solid #7C5CFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#7C5CFC",
              }}
            >
              {countdown}
            </Box>
          </Box>
        )}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={countdown > 0}
          onClick={onConfirm}
          startIcon={countdown <= 0 ? <RocketLaunchIcon /> : undefined}
          sx={{
            textTransform: "none",
            backgroundColor: countdown > 0 ? "#E4E7EC" : "#7C5CFC",
            color: countdown > 0 ? "#98A2B3" : "#fff",
            "&:hover": { backgroundColor: "#6A4CE0" },
            "&.Mui-disabled": { backgroundColor: "#E4E7EC", color: "#98A2B3" },
          }}
        >
          Start Promotion
        </Button>
      </DialogActions>
    </Dialog>
  );
}
