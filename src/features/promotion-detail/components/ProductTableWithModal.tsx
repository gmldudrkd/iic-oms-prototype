"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import type {
  ConditionType,
  ModalGroupItem,
  ModalItem,
  ModalProductItem,
} from "@/features/promotion-detail/components/ProductModal";
import ProductModal from "@/features/promotion-detail/components/ProductModal";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  pink: "#1570EF",
  pinkBg: "#EFF8FF",
  pinkBd: "#B2DDFF",
  green: "#099250",
  greenBg: "#ECFDF5",
  greenBd: "#A9EFC5",
  dark: "#344054",
  dkBg: "#F2F4F7",
  dkBd: "#D0D5DD",
  gray: "#667085",
  grBg: "#F9FAFB",
  grBd: "#EAECF0",
};

// ── Shared Atoms ──────────────────────────────────────────────────────────────
function CondBadge({ type }: { type: ConditionType }) {
  return (
    <div
      style={{
        display: "inline-flex",
        padding: "1px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        background: type === "AND" ? C.pinkBg : C.greenBg,
        color: type === "AND" ? C.pink : C.green,
        border: `1px solid ${type === "AND" ? C.pinkBd : C.greenBd}`,
      }}
    >
      {type}
    </div>
  );
}

function CondSeparator({ type }: { type: ConditionType }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}
    >
      <div style={{ flex: 1, height: 1, background: C.grBd }} />
      <CondBadge type={type} />
      <div style={{ flex: 1, height: 1, background: C.grBd }} />
    </div>
  );
}

function CondBadgeCenter({ type }: { type: ConditionType }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "2px 0 4px" }}
    >
      <CondBadge type={type} />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
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

  const allCount = items.reduce(
    (s, i) => s + (i.type === "group" ? i.products.length : 1),
    0,
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

  // ── Empty state ───────────────────────────────────────────────────────────
  if (allCount === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            border: "1px dashed #E0E0E0",
            borderRadius: 1,
            backgroundColor: "#FAFAFA",
            py: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#98A2B3" }}>
            No products selected yet.
          </Typography>
          {!disabled && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                border: "1.5px dashed #1570EF",
                color: "#1570EF",
                backgroundColor: "#EFF8FF",
                "&:hover": { backgroundColor: "#DBEAFE" },
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

  // ── Filled state ──────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          border: `1px solid ${C.grBd}`,
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: "10px 20px",
            borderBottom: `1px solid ${C.grBd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: C.grBg,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
            {allCount} product{allCount > 1 ? "s" : ""} selected
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 11, color: C.gray }}>
              Condition:
            </Typography>
            <CondBadge type={topCond} />
          </Box>
        </Box>

        {/* Items */}
        <Box
          sx={{
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={
                item.type === "group" ? item.id : (item as ModalProductItem).uid
              }
            >
              {idx > 0 && <CondSeparator type={topCond} />}

              {item.type === "product" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.grBg,
                    border: `1px solid ${C.grBd}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      width: 34,
                      height: 34,
                      background: C.dkBg,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.img}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 500, color: C.dark, fontSize: 13 }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>
                      {item.sap}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      background: C.dkBg,
                      borderRadius: 8,
                      color: C.gray,
                    }}
                  >
                    Individual
                  </span>
                  {!disabled && (
                    <IconButton
                      size="small"
                      onClick={() => removeItem(idx)}
                      sx={{ color: "#98A2B3" }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </div>
              )}

              {item.type === "group" &&
                (() => {
                  const group = item as ModalGroupItem;
                  return (
                    <div
                      style={{
                        background: C.grBg,
                        border: `1.5px solid ${C.dkBd}`,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#fff",
                            background: C.dark,
                            padding: "2px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {group.name}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "1px 7px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            background:
                              group.condition === "AND" ? C.pinkBg : C.greenBg,
                            color: group.condition === "AND" ? C.pink : C.green,
                            border: `1px solid ${group.condition === "AND" ? C.pinkBd : C.greenBd}`,
                          }}
                        >
                          {group.condition} inside
                        </span>
                        <div style={{ flex: 1 }} />
                        {!disabled && (
                          <IconButton
                            size="small"
                            onClick={() => removeItem(idx)}
                            sx={{ color: "#98A2B3" }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        )}
                      </div>
                      {group.products.map((p, pi) => (
                        <div key={p.id}>
                          {pi > 0 && <CondBadgeCenter type={group.condition} />}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: "#fff",
                              border: `1px solid ${C.grBd}`,
                              borderRadius: 7,
                              padding: "6px 10px",
                              marginBottom: 4,
                            }}
                          >
                            <span style={{ fontSize: 16 }}>{p.img}</span>
                            <div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: C.dark,
                                }}
                              >
                                {p.name}
                              </div>
                              <div style={{ fontSize: 10, color: C.gray }}>
                                {p.sap}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
            </div>
          ))}
        </Box>

        {/* Footer */}
        {!disabled && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderTop: `1px solid ${C.grBd}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
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
                border: "1.5px dashed #1570EF",
                color: "#1570EF",
                backgroundColor: "#EFF8FF",
                "&:hover": { backgroundColor: "#DBEAFE" },
              }}
            >
              Add Product
            </Button>
          </Box>
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
