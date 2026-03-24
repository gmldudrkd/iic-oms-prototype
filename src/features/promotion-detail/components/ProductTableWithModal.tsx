"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import type { ConditionType, ModalGroupItem, ModalItem, ModalProductItem } from "./ProductModal";
import ProductModal from "./ProductModal";

const BORDER_COLOR = "#E0E0E0";

function CondBadge({ type }: { type: ConditionType }) {
  const isAnd = type === "AND";
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        height: 18,
        fontSize: 9,
        fontWeight: 700,
        backgroundColor: isAnd ? "#EFF8FF" : "#ECFDF3",
        color: isAnd ? "#1570EF" : "#099250",
        border: `1px solid ${isAnd ? "#B2DDFF" : "#A9EFC5"}`,
        "& .MuiChip-label": { px: 0.75 },
      }}
    />
  );
}

interface ProductTableWithModalProps {
  items: ModalItem[];
  topCond: ConditionType;
  onChange: (items: ModalItem[], topCond: ConditionType) => void;
  disabled?: boolean;
  modalTitle?: string;
}

export default function ProductTableWithModal({
  items,
  topCond,
  onChange,
  disabled,
  modalTitle = "Add Products",
}: ProductTableWithModalProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const allIds = items.flatMap((i) =>
    i.type === "group" ? i.products.map((p) => p.id) : [i.id],
  );

  const handleConfirm = useCallback(
    (newItems: ModalItem[], newCond: ConditionType) => {
      onChange(newItems, newCond);
      setModalOpen(false);
    },
    [onChange],
  );

  const removeItem = useCallback(
    (idx: number) => {
      const item = items[idx];
      if (item.type === "group") {
        const ungrouped: ModalItem[] = item.products.map((p) => ({
          type: "product",
          uid: Date.now() + Math.random(),
          ...p,
        })) as unknown as ModalProductItem[];
        onChange(
          [...items.slice(0, idx), ...ungrouped, ...items.slice(idx + 1)],
          topCond,
        );
      } else {
        onChange(
          items.filter((_, i) => i !== idx),
          topCond,
        );
      }
    },
    [items, topCond, onChange],
  );

  if (allIds.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            border: `1px dashed ${BORDER_COLOR}`,
            borderRadius: 1,
            backgroundColor: "#FAFAFA",
            py: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#98A2B3" }}>No products selected yet.</Typography>
          {!disabled && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                border: "1.5px dashed #7C5CFC",
                color: "#7C5CFC",
                backgroundColor: "#F0EDFF",
                "&:hover": { backgroundColor: "#E4DCFF" },
              }}
            >
              Add Product
            </Button>
          )}
        </Box>
        {!disabled && (
          <ProductModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirm}
            initialItems={items}
            initialTopCond={topCond}
            title={modalTitle}
          />
        )}
      </Box>
    );
  }

  // Build rows
  const rows: React.ReactNode[] = [];
  items.forEach((item, idx) => {
    // Condition separator
    if (idx > 0) {
      rows.push(
        <Box
          key={`cond-${idx}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 0.25,
            backgroundColor: "#FAFAFA",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <CondBadge type={topCond} />
        </Box>,
      );
    }

    if (item.type === "product") {
      rows.push(
        <Box
          key={`p-${(item as ModalProductItem).uid}`}
          sx={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 100px 80px 40px",
            px: 1.5,
            py: 1,
            gap: 1,
            borderBottom: "1px solid #E0E0E0",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ fontSize: 18, textAlign: "center" }}>{item.img}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.87)", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)", mt: 0.25 }}>{item.id} · {item.sap}</Typography>
          </Box>
          <Box>
            <Chip label="Individual" size="small" sx={{ fontSize: 11, backgroundColor: "#e7e7e7", color: "#667085", height: 22 }} />
          </Box>
          <Box><CondBadge type={topCond} /></Box>
          <Box>
            {!disabled && (
              <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: "#98A2B3" }}>
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
        </Box>,
      );
    } else {
      const group = item as ModalGroupItem;
      group.products.forEach((p, pi) => {
        if (pi > 0) {
          rows.push(
            <Box
              key={`gcond-${group.id}-${pi}`}
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 0.25,
                backgroundColor: group.color.bg,
                borderBottom: `1px solid ${group.color.border}22`,
              }}
            >
              <CondBadge type={group.condition} />
            </Box>,
          );
        }
        rows.push(
          <Box
            key={`g-${group.id}-${p.id}-${pi}`}
            sx={{
              display: "grid",
              gridTemplateColumns: "36px 1fr 100px 80px 40px",
              px: 1.5,
              py: 1,
              gap: 1,
              borderBottom: `1px solid ${group.color.border}22`,
              alignItems: "center",
              backgroundColor: group.color.bg,
            }}
          >
            <Box sx={{ fontSize: 18, textAlign: "center" }}>{p.img}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.87)", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</Typography>
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)", mt: 0.25 }}>{p.id} · {p.sap}</Typography>
            </Box>
            <Box>
              <Chip
                label={group.name}
                size="small"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: group.color.text,
                  backgroundColor: group.color.badge,
                  border: `1px solid ${group.color.border}`,
                  height: 22,
                }}
              />
            </Box>
            <Box><CondBadge type={group.condition} /></Box>
            <Box>
              {pi === 0 && !disabled && (
                <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: "#98A2B3" }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          </Box>,
        );
      });
    }
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 1, backgroundColor: "#FAFAFA", overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 100px 80px 40px",
            backgroundColor: "#e7e7e7",
            borderBottom: "1px solid #E0E0E0",
            px: 1.5,
            py: 0.75,
            gap: 1,
          }}
        >
          {["", "Product", "Type", "Condition", ""].map((h, i) => (
            <Typography key={i} sx={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {rows}

        {/* Footer */}
        <Box sx={{ px: 1.5, py: 1, borderTop: "1px solid #E0E0E0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 11, color: "#98A2B3" }}>
            {allIds.length} product{allIds.length > 1 ? "s" : ""} selected
          </Typography>
          {!disabled && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                startIcon={<RestartAltIcon />}
                onClick={() => onChange([], "OR")}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "none",
                  border: "1.5px solid #F04438",
                  color: "#F04438",
                  backgroundColor: "#FFF1F0",
                  "&:hover": { backgroundColor: "#FFE4E1" },
                }}
              >
                Reset
              </Button>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "none",
                  border: "1.5px dashed #7C5CFC",
                  color: "#7C5CFC",
                  backgroundColor: "#F0EDFF",
                  "&:hover": { backgroundColor: "#E4DCFF" },
                }}
              >
                Add Product
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {!disabled && (
        <ProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
          initialItems={items}
          initialTopCond={topCond}
          title={modalTitle}
        />
      )}
    </Box>
  );
}
